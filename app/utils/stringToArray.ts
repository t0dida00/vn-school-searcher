export function stringToArray(value: any): string[] {
  if (Array.isArray(value)) return value;

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch (_error) {
      console.warn("stringToArray: Failed to parse string", _error);
      return [];
    }
  }

  return [];
}
