const LOOKS_LIKE_URL = /^https?:\/\/.+/i;

function pushValidUrl(out: string[], raw: unknown) {
  if (typeof raw !== "string") return;
  const t = raw.trim();
  if (LOOKS_LIKE_URL.test(t)) out.push(t);
}

/**
 * Normalizes `housing_property_records.main_image_url` (JSONB) into displayable image URLs.
 * Supports: JSON string array, string URL, or objects with `urls` | `images` | `image_urls` | `url` | `src`.
 */
export function listingImageUrlsFromMainImage(mainImageUrl: unknown): string[] {
  if (mainImageUrl == null) return [];

  if (Array.isArray(mainImageUrl)) {
    const out: string[] = [];
    for (const item of mainImageUrl) pushValidUrl(out, item);
    return out;
  }

  if (typeof mainImageUrl === "string") {
    const t = mainImageUrl.trim();
    if (!t) return [];
    if ((t.startsWith("[") && t.endsWith("]")) || (t.startsWith("{") && t.endsWith("}"))) {
      try {
        return listingImageUrlsFromMainImage(JSON.parse(t) as unknown);
      } catch {
        return LOOKS_LIKE_URL.test(t) ? [t] : [];
      }
    }
    return LOOKS_LIKE_URL.test(t) ? [t] : [];
  }

  if (typeof mainImageUrl === "object") {
    const o = mainImageUrl as Record<string, unknown>;
    const nested = o.urls ?? o.images ?? o.image_urls;
    if (nested != null) return listingImageUrlsFromMainImage(nested);
    const single = o.url ?? o.src;
    if (single != null) return listingImageUrlsFromMainImage(single);
  }

  return [];
}
