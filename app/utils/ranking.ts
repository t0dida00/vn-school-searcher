// properties.ranking holds the uniRank 2026 national rank (https://www.unirank.org/fi/ranking/) as a
// string, "" when uniRank doesn't list the school.
export const RANKING_SOURCE = "uniRank 2026 ranking in Finland";

export function rankOf(school: any): number | null {
    const rank = Number.parseInt(String(school?.properties?.ranking ?? ""), 10);
    return Number.isFinite(rank) && rank > 0 ? rank : null;
}

// Best rank first; unranked schools go last, alphabetically
export function byRanking(a: any, b: any): number {
    const ra = rankOf(a) ?? Infinity;
    const rb = rankOf(b) ?? Infinity;
    if (ra !== rb) return ra - rb;
    return String(a?.properties?.name ?? "").localeCompare(String(b?.properties?.name ?? ""));
}
