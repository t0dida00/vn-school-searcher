// Stable slug from the data (e.g. "tampere"); used for markers, saved schools and /school/[id] URLs
export function schoolId(school: any): string {
    return school?.properties?.id ?? school?._id;
}
