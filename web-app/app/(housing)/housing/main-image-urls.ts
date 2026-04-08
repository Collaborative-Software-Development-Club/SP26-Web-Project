/** Normalize `housing_property_records.main_image_url` (JSONB) to a list of image URLs. */
export function parseMainImageUrls(raw: unknown): string[] {
  if (raw == null) return [];
  if (typeof raw === "string") {
    const s = raw.trim();
    return s ? [s] : [];
  }
  if (Array.isArray(raw)) {
    return raw.filter((x): x is string => typeof x === "string" && x.trim() !== "");
  }
  return [];
}
