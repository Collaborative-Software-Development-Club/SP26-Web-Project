"use client";

import type { UserProfile } from "@/app/(profile)/types";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Pencil, Plus, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useId, useRef, useState, type MouseEvent } from "react";

const PFP_BUCKET = "pfp";
const MAX_BYTES = 20 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

function extensionForPfpMime(mime: string): string {
  switch (mime) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/gif":
      return "gif";
    case "image/webp":
      return "webp";
    default:
      return "jpg";
  }
}

function pfpPathFromPublicUrl(publicUrl: string, bucket: string): string | null {
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
  update: <K extends keyof UserProfile>(
    key: K,
    value: UserProfile[K],
  ) => void;
  onUploadingChange?: (uploading: boolean) => void;
}) {
  const router = useRouter();
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const setUploading = (v: boolean) => {
    setIsUploading(v);
    onUploadingChange?.(v);
  };

  const handleFile = async (file: File | undefined) => {
    setLocalError(null);

    if (!file) return;

    if (!ALLOWED_TYPES.has(file.type)) {
      setLocalError("Please choose a JPEG, PNG, GIF, or WebP image.");
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
      const hint =
        uploadError.message.includes("row-level security") ||
        uploadError.message.includes("RLS")
          ? " Ask an admin to apply storage policies for the pfp bucket (see web-app/supabase/pfp-storage-policies.sql)."
          : "";
      setLocalError("Failed to upload profile picture: " + uploadError.message + hint);
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
      .update({ avatar_url: "" })
      .eq("user_id", user.id);

    if (error) {
      setUploading(false);
      setLocalError("Failed to clear profile picture: " + error.message);
      return;
    }

    update("avatar_url", "");
    setUploading(false);
    router.refresh();
  };

  const openFilePicker = () => {
    if (!isSubmitting && !isUploading) fileInputRef.current?.click();
  };

  const savedUrl = profile.avatar_url?.trim() ?? "";
  const hasPhoto = Boolean(savedUrl);
  const busy = isSubmitting || isUploading;

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
            <span
              className="absolute inset-0 flex items-center justify-center px-2 text-center text-[0.65rem] font-medium leading-tight text-muted-foreground transition-opacity group-hover:opacity-0 sm:text-xs"
            >
              No Profile Picture
            </span>
            <Plus
              className="relative z-10 size-10 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
              strokeWidth={1.75}
              aria-hidden
            />
            {isUploading && (
              <div className="absolute inset-0 z-[5] flex items-center justify-center rounded-full bg-background/70 text-sm font-medium">
                Uploading…
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
                alt=""
                fill
                className="object-cover"
                unoptimized
              />

              {isUploading && (
                <div className="absolute inset-0 z-[5] flex items-center justify-center bg-background/70 text-sm font-medium">
                  Uploading…
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
                  isEditMode && savedUrl ? "Replace profile photo" : "Change profile photo"
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

      {localError && (
        <p className="text-sm text-destructive" role="alert">
          {localError}
        </p>
      )}
    </div>
  );
}
