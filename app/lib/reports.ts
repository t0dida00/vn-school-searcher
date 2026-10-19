// "Report a problem" in a school's details: the reasons people can pick, shared by the form
// (app/components/SchoolDetails/ReportProblem.tsx) and the API that stores them (app/api/reports/route.ts).
// Plain module (not "use client") so the route can import it.
export const REPORT_REASONS = [
    { value: "logo", label: "Wrong or missing logo" },
    { value: "location", label: "Wrong location on the map" },
    { value: "data", label: "Inaccurate or outdated information" },
    { value: "website", label: "Website link broken or wrong" },
    { value: "contact", label: "Wrong contact details" },
    { value: "campus", label: "Missing or wrong campus" },
    { value: "ranking", label: "Wrong ranking" },
] as const;

export type ReportReason = (typeof REPORT_REASONS)[number]["value"];

export const REPORT_NOTE_MAX = 1000;

export function isReportReason(value: unknown): value is ReportReason {
    return REPORT_REASONS.some((r) => r.value === value);
}
