/** Normalize `housing_property_records.main_image_url` (JSONB) into displayable image URLs. */
export function mainImageUrlsFromRecord(raw: unknown): string[] {
  if (raw == null) return [];

  if (Array.isArray(raw)) {
    return raw
      .filter((x): x is string => typeof x === "string")
      .map((s) => s.trim())
      .filter(isHttpUrl);
  }

  if (typeof raw === "string") {
    const t = raw.trim();
    if (!t) return [];
    if (t.startsWith("[")) {
      try {
        return mainImageUrlsFromRecord(JSON.parse(t) as unknown);
      } catch {
        return isHttpUrl(t) ? [t] : [];
      }
    }
    return isHttpUrl(t) ? [t] : [];
  }

  if (typeof raw === "object" && raw !== null && "urls" in raw) {
    return mainImageUrlsFromRecord((raw as { urls: unknown }).urls);
  }

  return [];
}

function isHttpUrl(s: string): boolean {
  return /^https?:\/\//i.test(s);
}

/** Alias for list/card code; same normalization as {@link mainImageUrlsFromRecord}. */
export function parseMainImageUrls(raw: unknown): string[] {
  return mainImageUrlsFromRecord(raw);
}
