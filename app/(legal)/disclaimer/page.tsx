import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { ContactLink } from "../LegalPage";

export const metadata: Metadata = {
    title: "Disclaimer & terms of use",
    description: "Unies (FinUnies, VieUnies) is an independent, unofficial guide. Read how to use the information.",
    alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage() {
    return (
        <LegalPage
            title="Disclaimer & terms of use"
            updated="19 October 2026"
            intro={
                <>
                    Unies, including FinUnies and VieUnies (&quot;the site&quot;), is a free, independent guide to universities
                    abroad. By using the site you accept the terms below.
                </>
            }
        >
            <section>
                <h2>Not an official website</h2>
                <p>
                    The site is an independent project. It isn&apos;t affiliated with, endorsed by or connected to any
                    university, university of applied sciences, ministry, admissions service or other authority in any
                    country. The site doesn&apos;t handle applications or admissions.
                </p>
            </section>

            <section>
                <h2>Information is for general guidance only</h2>
                <p>
                    We collect school information (programmes, campuses, tuition fees, scholarships, contact details) from
                    official websites and public sources, but it can be incomplete, out of date or wrong. It isn&apos;t
                    admissions, legal, immigration or financial advice. Always confirm everything on the school&apos;s
                    official website or with the school before you apply, pay or travel.
                </p>
                <ul>
                    <li>
                        <strong>Rankings</strong> show each school&apos;s position in the national uniRank 2026 ranking, which is
                        based on web metrics rather than teaching or research quality.
                    </li>
                    <li>
                        <strong>Tuition fees and scholarships</strong> are indicative; they vary by programme, nationality and
                        year.
                    </li>
                    <li>
                        <strong>Campus locations</strong> on the maps are approximate.
                    </li>
                </ul>
            </section>

            <section>
                <h2>Maps</h2>
                <p>
                    Base maps come from Mapbox and OpenStreetMap, and the country outlines are simplified shapes based on
                    geoBoundaries data. Borders, coastlines and place names may be inaccurate or incomplete and don&apos;t
                    represent any official or political position.
                </p>
            </section>

            <section>
                <h2>Names, logos and trademarks</h2>
                <p>
                    School names, logos and trademarks belong to their owners and are shown only to identify the schools. If
                    you represent a school and would like a logo or text changed or removed, email{" "}
                    <ContactLink subject="Logo or content request" />.
                </p>
            </section>

            <section>
                <h2>Links to other websites</h2>
                <p>
                    The site links to school websites and other services we don&apos;t control. We aren&apos;t responsible for
                    their content, availability or privacy practices.
                </p>
            </section>

            <section>
                <h2>Limitation of liability</h2>
                <p>
                    The site is provided free of charge, &quot;as is&quot;, without any warranty that it is complete,
                    accurate, current or always available. To the extent the law allows, we accept no responsibility for any
                    loss, cost, missed deadline or other consequence of relying on the information. You are responsible for
                    checking information with the schools and official sources before acting on it.
                </p>
            </section>

            <section>
                <h2>Corrections and contact</h2>
                <p>
                    Found a mistake? Email <ContactLink subject="Data correction" /> with the school name, what&apos;s wrong
                    and, if possible, a link to the official source. For how we handle data, see the{" "}
                    <Link href="/privacy">privacy policy</Link>.
                </p>
            </section>
        </LegalPage>
    );
}
