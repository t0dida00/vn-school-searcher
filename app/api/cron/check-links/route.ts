// app/api/cron/check-links/route.ts
// Quarterly job (see vercel.json): checks every school's website and logo URL
// and stores a report in schoolAPI.link_checks so broken links can be fixed.
import { NextResponse, type NextRequest } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { COUNTRIES, COUNTRY_CODES, type CountryCode } from '../../../lib/countries';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const TIMEOUT_MS = 10_000;
// Some school sites (e.g. tuni.fi) reject non-browser user agents
const USER_AGENT = 'Mozilla/5.0 (compatible; FinUniesLinkChecker/1.0; +https://finunies.vercel.app)';
// Statuses that usually mean bot protection rather than a dead link
const BLOCKED_STATUSES = new Set([401, 403, 406, 429]);

type LinkStatus = 'ok' | 'blocked' | 'broken' | 'missing';

type LinkResult = {
  country: CountryCode;
  id: string;
  name: string;
  field: 'website' | 'logo';
  url: string;
  status: LinkStatus;
  httpStatus?: number;
  error?: string;
};

async function request(url: string, method: 'HEAD' | 'GET') {
  return fetch(url, {
    method,
    redirect: 'follow',
    // Some servers (e.g. seamk.fi) return 500 when Accept is missing
    headers: { 'User-Agent': USER_AGENT, Accept: 'text/html,image/*,*/*;q=0.8', 'Accept-Language': 'en' },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    cache: 'no-store',
  });
}

async function checkUrl(url: string): Promise<Pick<LinkResult, 'status' | 'httpStatus' | 'error'>> {
  if (!url) return { status: 'missing' };
  try {
    let res = await request(url, 'HEAD');
    // Plenty of servers don't implement HEAD properly, so retry with GET
    if (res.status >= 400) res = await request(url, 'GET');
    if (res.ok) return { status: 'ok', httpStatus: res.status };
    return { status: BLOCKED_STATUSES.has(res.status) ? 'blocked' : 'broken', httpStatus: res.status };
  } catch (error) {
    return { status: 'broken', error: error instanceof Error ? error.message : String(error) };
  }
}

export async function GET(request: NextRequest) {
  // Vercel Cron sends `Authorization: Bearer $CRON_SECRET`
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'CRON_SECRET is not configured' }, { status: 500 });
  }
  if (request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db('schoolAPI');
    const projection = { 'properties.id': 1, 'properties.name': 1, 'properties.website': 1, 'properties.logo': 1 };
    const schools = (
      await Promise.all(
        COUNTRY_CODES.map(async (country) =>
          (await db.collection(COUNTRIES[country].collection).find({}, { projection }).toArray()).map((s) => ({ country, properties: s.properties })),
        ),
      )
    ).flat();

    const results: LinkResult[] = await Promise.all(
      schools.flatMap(({ country, properties: p = {} }) =>
        (['website', 'logo'] as const).map(async (field) => ({
          country,
          id: p.id,
          name: p.name,
          field,
          url: p[field] ?? '',
          ...(await checkUrl(p[field] ?? '')),
        })),
      ),
    );

    const problems = results.filter((r) => r.status !== 'ok');
    const report = {
      checkedAt: new Date(),
      schools: schools.length,
      linksChecked: results.length,
      problemCount: problems.length,
      problems,
    };
    await db.collection('link_checks').insertOne(report);

    if (problems.length) console.warn(`Link check found ${problems.length} problem(s)`, problems);
    return NextResponse.json(report, { status: 200 });
  } catch (error) {
    console.error('Link check failed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
