// properties.ranking holds the national rank as a string (source per country in COUNTRIES[*].ranking),
// "" when the ranking doesn't list the school.

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
