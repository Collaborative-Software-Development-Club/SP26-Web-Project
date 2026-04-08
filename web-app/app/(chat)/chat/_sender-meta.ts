/** Server-safe helpers for group message sender labels (shared shape with client props). */

export type SenderMetaEntry = {
  displayName: string;
  initials: string;
};

export function buildSenderMetaFromProfiles(
  profiles: {
    user_id: string;
    fname: string | null;
    lname: string | null;
  }[],
): Record<string, SenderMetaEntry> {
  const map: Record<string, SenderMetaEntry> = {};
  for (const p of profiles) {
    const trimmed = `${p.fname ?? ""} ${p.lname ?? ""}`.trim();
    const displayName = trimmed || p.user_id;
    const parts = displayName.split(/\s+/).filter(Boolean);
    let initials = "??";
    if (parts.length >= 2) {
      initials = `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
    } else if (parts.length === 1 && parts[0].length >= 2) {
      initials = parts[0].slice(0, 2).toUpperCase();
    } else if (parts.length === 1 && parts[0].length === 1) {
      initials = parts[0].toUpperCase();
    } else if (p.user_id.length >= 2) {
      initials = p.user_id.slice(0, 2).toUpperCase();
    }
    if (initials.length > 2) initials = initials.slice(0, 2);
    map[p.user_id] = { displayName, initials };
  }
  return map;
}
