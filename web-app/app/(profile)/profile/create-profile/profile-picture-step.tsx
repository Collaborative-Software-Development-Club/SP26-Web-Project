"use client";

import type { UserProfile } from "@/app/(profile)/types";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Loader2, Pencil, Plus, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useId, useRef, useState, type MouseEvent } from "react";

const PFP_BUCKET = "pfp";
const LIFESTYLE_BUCKET = "lifestyle_pic";
const MAX_BYTES = 20 * 1024 * 1024;
const MAX_LIFESTYLE_PHOTOS = 2;

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function extensionForPfpMime(mime: string): string {
  switch (mime) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return "jpg";
  }
}

function pfpPathFromPublicUrl(
  publicUrl: string,
  bucket: string,
): string | null {
  const base = publicUrl.trim().split("?")[0];
  const marker = `/object/public/${bucket}/`;
  const i = base.indexOf(marker);
  if (i === -1) return null;
  try {
    return decodeURIComponent(base.slice(i + marker.length));
  } catch {
    return null;
  }
}

function lifestylePathFromPublicUrl(publicUrl: string): string | null {
  return pfpPathFromPublicUrl(publicUrl, LIFESTYLE_BUCKET);
}

function isLifestyle2StorageUrl(publicUrl: string): boolean {
  const path = lifestylePathFromPublicUrl(publicUrl) ?? publicUrl;
  return /lifestyle2\./.test(path);
}

function getLifestyleSlots(
  photos: string[] | undefined,
): [string | null, string | null] {
  const p = photos ?? [];
  if (p.length >= 2) {
    return [p[0] || null, p[1] || null];
  }
  if (p.length === 1) {
    const u = p[0];
    if (u && isLifestyle2StorageUrl(u)) {
      return [null, u];
    }
    return [u, null];
  }
  return [null, null];
}

function storedArrayFromLifestyleSlots(
  slots: [string | null, string | null],
): string[] {
  return [slots[0], slots[1]].filter((u): u is string => Boolean(u));
}

const LIFESTYLE_SLOT_LABELS = ["Lifestyle 1", "Lifestyle 2"] as const;

export function ProfilePictureStep({
  profile,
  isEditMode,
  isSubmitting,
  update,
  onUploadingChange,
}: {
  profile: UserProfile;
  isEditMode: boolean;
  isSubmitting: boolean;
  update: <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => void;
  onUploadingChange?: (uploading: boolean) => void;
}) {
  const router = useRouter();
  const inputId = useId();
  const lifestyle0InputId = useId();
  const lifestyle1InputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lifestyle0FileInputRef = useRef<HTMLInputElement>(null);
  const lifestyle1FileInputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [lifestyleSlotBusy, setLifestyleSlotBusy] = useState<0 | 1 | null>(
    null,
  );

  const setUploading = (v: boolean) => {
    setIsUploading(v);
    onUploadingChange?.(v);
  };

  const handleFile = async (file: File | undefined) => {
    setLocalError(null);

    if (!file) return;

    if (!ALLOWED_TYPES.has(file.type)) {
      setLocalError("Please choose a JPEG, PNG, or WebP image.");
      return;
    }

    if (file.size > MAX_BYTES) {
      setLocalError("Image must be 20 MB or smaller.");
      return;
    }

    setUploading(true);
    const supabase = createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setUploading(false);
      setLocalError("You must be signed in to upload a photo.");
      return;
    }

    const ext = extensionForPfpMime(file.type);
    const path = `${user.id}/profile.${ext}`;

    const previousStored = (profile.avatar_url ?? "").trim();
    if (previousStored) {
      const previousPath = pfpPathFromPublicUrl(previousStored, PFP_BUCKET);
      if (
        previousPath &&
        previousPath.startsWith(`${user.id}/`) &&
        previousPath !== path
      ) {
        await supabase.storage.from(PFP_BUCKET).remove([previousPath]);
      }
    }

    const { error: uploadError } = await supabase.storage
      .from(PFP_BUCKET)
      .upload(path, file, {
        upsert: true,
        contentType: file.type,
        cacheControl: "3600",
      });

    if (uploadError) {
      setUploading(false);
      setLocalError("Failed to upload profile picture: " + uploadError.message);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(PFP_BUCKET).getPublicUrl(path);

    const avatarUrl = `${publicUrl}?t=${Date.now()}`;

    const { data: existing } = await supabase
      .from("user_profiles")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      const { error: dbError } = await supabase
        .from("user_profiles")
        .update({ avatar_url: avatarUrl })
        .eq("user_id", user.id);

      if (dbError) {
        await supabase.storage.from(PFP_BUCKET).remove([path]);
        setUploading(false);
        setLocalError("Failed to save profile picture URL: " + dbError.message);
        return;
      }
    }
    // No profile row yet: keep avatar_url in form state only; saveProfileAction upserts it.

    update("avatar_url", avatarUrl);
    setUploading(false);
    router.refresh();
  };

  const handleRemove = async (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setLocalError(null);

    const previous = profile.avatar_url?.trim() || null;
    if (!previous) return;

    setUploading(true);
    const supabase = createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setUploading(false);
      setLocalError("You must be signed in.");
      return;
    }

    const path = pfpPathFromPublicUrl(previous, PFP_BUCKET);
    if (path && path.startsWith(`${user.id}/`)) {
      await supabase.storage.from(PFP_BUCKET).remove([path]);
    }

    const { error } = await supabase
      .from("user_profiles")
      .update({ avatar_url: null })
      .eq("user_id", user.id);

    if (error) {
      setUploading(false);
      setLocalError("Failed to clear profile picture: " + error.message);
      return;
    }

    update("avatar_url", null);
    setUploading(false);
    router.refresh();
  };

  const openFilePicker = () => {
    if (!isSubmitting && !isUploading) fileInputRef.current?.click();
  };

  const openLifestyleFilePicker = (index: 0 | 1) => {
    if (isSubmitting || lifestyleSlotBusy !== null) return;
    (index === 0
      ? lifestyle0FileInputRef
      : lifestyle1FileInputRef
    ).current?.click();
  };

  const handleLifestyleFile = async (file: File | undefined, index: 0 | 1) => {
    setLocalError(null);

    if (!file) return;

    if (!ALLOWED_TYPES.has(file.type)) {
      setLocalError("Please choose a JPEG, PNG, or WebP image.");
      return;
    }

    if (file.size > MAX_BYTES) {
      setLocalError("Image must be 20 MB or smaller.");
      return;
    }

    setLifestyleSlotBusy(index);
    const supabase = createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setLifestyleSlotBusy(null);
      setLocalError("You must be signed in to upload a photo.");
      return;
    }

    const ext = extensionForPfpMime(file.type);
    const path = `${user.id}/lifestyle${index + 1}.${ext}`;

    const slots = getLifestyleSlots(profile.lifestyle_images);
    const existingUrl = slots[index];
    if (existingUrl) {
      const existingPath = lifestylePathFromPublicUrl(existingUrl);
      if (existingPath && existingPath.startsWith(`${user.id}/`)) {
        await supabase.storage.from(LIFESTYLE_BUCKET).remove([existingPath]);
      }
    }

    const { error: uploadError } = await supabase.storage
      .from(LIFESTYLE_BUCKET)
      .upload(path, file, {
        upsert: true,
        contentType: file.type,
        cacheControl: "3600",
      });

    if (uploadError) {
      setLifestyleSlotBusy(null);
      setLocalError("Failed to upload lifestyle photo: " + uploadError.message);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(LIFESTYLE_BUCKET).getPublicUrl(path);

    const newPhotoUrl = `${publicUrl}?t=${Date.now()}`;

    const next: [string | null, string | null] = [
      index === 0 ? newPhotoUrl : slots[0],
      index === 1 ? newPhotoUrl : slots[1],
    ];

    const { error: dbError } = await supabase
      .from("user_profile_living_images")
      .upsert({
        user_id: user.id,
        image_url: newPhotoUrl,
      });

    if (dbError) {
      setLifestyleSlotBusy(null);
      setLocalError("Failed to save lifestyle photo to database");
      return;
    }

    update("lifestyle_images", storedArrayFromLifestyleSlots(next));
    setLifestyleSlotBusy(null);
    router.refresh();
  };

  const handleRemoveLifestyle = async (e: MouseEvent, index: 0 | 1) => {
    e.stopPropagation();
    e.preventDefault();
    setLocalError(null);

    const slots = getLifestyleSlots(profile.lifestyle_images);
    const urlToRemove = slots[index];
    if (!urlToRemove) return;

    setLifestyleSlotBusy(index);
    const supabase = createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setLifestyleSlotBusy(null);
      setLocalError("You must be signed in.");
      return;
    }

    const path = lifestylePathFromPublicUrl(urlToRemove);
    if (path && path.startsWith(`${user.id}/`)) {
      await supabase.storage.from(LIFESTYLE_BUCKET).remove([path]);
    }

    const next: [string | null, string | null] = [
      index === 0 ? null : slots[0],
      index === 1 ? null : slots[1],
    ];

    const { error: dbError } = await supabase
      .from("user_profile_living_images")
      .delete()
      .eq("user_id", user.id)
      .eq("image_url", urlToRemove)
      .maybeSingle();

    if (dbError) {
      setLifestyleSlotBusy(null);
      setLocalError("Failed to remove lifestyle photo from database");
      return;
    }

    update("lifestyle_images", storedArrayFromLifestyleSlots(next));
    setLifestyleSlotBusy(null);
    router.refresh();
  };

  const savedUrl = profile.avatar_url?.trim() ?? "";
  const hasPhoto = Boolean(savedUrl);
  const busy = isSubmitting || isUploading;
  const lifestyleSlots = getLifestyleSlots(profile.lifestyle_images);
  const busyLifestyle = isSubmitting || lifestyleSlotBusy !== null;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {isEditMode ? (
          <>You can replace your profile picture by uploading a new one.</>
        ) : (
          <>
            Choose a profile picture up to 20&nbsp;MB. It uploads as soon as you
            pick a file. You can skip this step and add one later.
          </>
        )}
      </p>

      <div className="flex flex-col items-center gap-3">
        <input
          id={inputId}
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="sr-only"
          disabled={busy}
          onChange={(e) => {
            const file = e.target.files?.[0];
            void handleFile(file);
            e.target.value = "";
          }}
        />

        {!hasPhoto ? (
          <button
            type="button"
            disabled={busy}
            onClick={openFilePicker}
            className={cn(
              "group relative flex size-36 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-muted-foreground/30 bg-muted/40 transition-colors",
              "hover:border-muted-foreground/50 hover:bg-muted/55",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              busy && "pointer-events-none opacity-50",
            )}
            aria-label="Upload profile photo"
          >
            <span className="absolute inset-0 flex items-center justify-center px-2 text-center text-[0.65rem] font-medium leading-tight text-muted-foreground transition-opacity group-hover:opacity-0 sm:text-xs">
              No Profile Picture
            </span>
            <Plus
              className="relative z-10 size-10 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
              strokeWidth={1.75}
              aria-hidden
            />
            {isUploading && (
              <div className="absolute inset-0 z-[5] flex items-center justify-center rounded-full bg-background/70 text-sm font-medium">
                Working…
              </div>
            )}
          </button>
        ) : (
          <div
            className={cn(
              "group relative size-36 shrink-0",
              busy && "pointer-events-none opacity-50",
            )}
          >
            <div className="relative size-full overflow-hidden rounded-full border-2 border-muted-foreground/20 bg-muted/30">
              <Image
                src={savedUrl}
                alt={`${profile.fname} ${profile.lname}`}
                fill
                className="object-cover"
                unoptimized
              />

              {isUploading && (
                <div className="absolute inset-0 z-[5] flex items-center justify-center bg-background/70 text-sm font-medium">
                  <Loader2 className="size-4 animate-spin" />
                </div>
              )}

              <button
                type="button"
                disabled={busy}
                onClick={openFilePicker}
                className={cn(
                  "absolute inset-0 z-[1] flex items-center justify-center rounded-full transition-colors",
                  "bg-foreground/0 opacity-0 md:group-hover:bg-foreground/45 md:group-hover:opacity-100",
                  "focus-visible:bg-foreground/45 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                )}
                aria-label={
                  isEditMode && savedUrl
                    ? "Replace profile photo"
                    : "Change profile photo"
                }
              >
                <Pencil
                  className="size-9 text-background drop-shadow-sm"
                  strokeWidth={2}
                  aria-hidden
                />
              </button>
            </div>

            <button
              type="button"
              disabled={busy}
              onClick={(e) => void handleRemove(e)}
              className={cn(
                "absolute -right-0.5 -top-0.5 z-10 flex size-8 items-center justify-center rounded-full border border-border bg-background shadow-md transition-opacity",
                "opacity-100 md:opacity-0 md:group-hover:opacity-100",
                "hover:bg-muted focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
              aria-label="Remove profile photo"
            >
              <X className="size-4 text-muted-foreground" strokeWidth={2} />
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 space-y-3">
        <p className="text-sm text-muted-foreground">
          Optionally add up to {MAX_LIFESTYLE_PHOTOS} lifestyle photos to show
          your living style.
        </p>

        <input
          id={lifestyle0InputId}
          ref={lifestyle0FileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="sr-only"
          disabled={busyLifestyle}
          onChange={(e) => {
            const file = e.target.files?.[0];
            void handleLifestyleFile(file, 0);
            e.target.value = "";
          }}
        />
        <input
          id={lifestyle1InputId}
          ref={lifestyle1FileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="sr-only"
          disabled={busyLifestyle}
          onChange={(e) => {
            const file = e.target.files?.[0];
            void handleLifestyleFile(file, 1);
            e.target.value = "";
          }}
        />

        <div className="grid grid-cols-2 gap-3">
          {LIFESTYLE_SLOT_LABELS.map((label, index) => {
            const slot = index as 0 | 1;
            const url = lifestyleSlots[slot];
            const thisSlotBusy = lifestyleSlotBusy === slot;
            return (
              <div
                key={label}
                className={cn(
                  "group relative aspect-square",
                  busyLifestyle && "pointer-events-none opacity-50",
                )}
              >
                {url ? (
                  <div className="relative size-full overflow-hidden rounded-xl border border-muted-foreground/20 bg-muted/30">
                    <Image
                      src={url}
                      alt={label}
                      fill
                      className="object-cover"
                      unoptimized
                    />

                    <button
                      type="button"
                      disabled={busyLifestyle}
                      onClick={() => openLifestyleFilePicker(slot)}
                      className={cn(
                        "absolute inset-0 z-[1] flex items-center justify-center rounded-xl transition-colors",
                        "bg-foreground/0 opacity-0 md:group-hover:bg-foreground/45 md:group-hover:opacity-100",
                        "focus-visible:bg-foreground/45 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      )}
                      aria-label={`Replace ${label} photo`}
                    >
                      <Pencil
                        className="size-8 text-background drop-shadow-sm"
                        strokeWidth={2}
                        aria-hidden
                      />
                    </button>

                    {thisSlotBusy && (
                      <div className="absolute inset-0 z-[5] flex items-center justify-center bg-background">
                        <Loader2 className="size-10 animate-spin" />
                      </div>
                    )}

                    <button
                      type="button"
                      disabled={busyLifestyle}
                      onClick={(e) => void handleRemoveLifestyle(e, slot)}
                      className={cn(
                        "absolute -right-1 -top-1 z-10 flex size-7 items-center justify-center rounded-full border border-border bg-background shadow-md transition-opacity",
                        "opacity-100 md:opacity-0 md:group-hover:opacity-100",
                        "hover:bg-muted focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      )}
                      aria-label={`Remove ${label} photo`}
                    >
                      <X
                        className="size-4 text-muted-foreground"
                        strokeWidth={2}
                      />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={busyLifestyle}
                    onClick={() => openLifestyleFilePicker(slot)}
                    className={cn(
                      "group relative flex size-full flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/40 p-2 transition-colors",
                      "hover:border-muted-foreground/50 hover:bg-muted/80",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    )}
                    aria-label={`Upload ${label} photo (${slot === 0 ? "lifestyle1" : "lifestyle2"})`}
                  >
                    <span className="text-center text-xs font-medium text-muted-foreground">
                      {label}
                    </span>
                    {thisSlotBusy && (
                      <div className="absolute inset-0 z-[5] flex items-center justify-center bg-background">
                        <Loader2 className="size-10 animate-spin" />
                      </div>
                    )}
                    <Plus
                      className="size-7 text-muted-foreground opacity-80 group-hover:opacity-100"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {localError && (
        <p className="text-sm text-destructive" role="alert">
          {localError}
        </p>
      )}
    </div>
  );
}
