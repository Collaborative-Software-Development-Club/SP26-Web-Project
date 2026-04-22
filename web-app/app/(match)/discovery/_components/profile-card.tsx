"use client";

import { useState, useEffect, useRef } from "react";
import { DiscoveryProfile, LikedYouProfile } from "../types";
import { ProfilePreferences } from "./profile-preferences";
import { LikeButton } from "./like-button";
import { DislikeButton } from "./dislike-button";
import { MessageButton } from "./message-button";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/contexts/UserContext";

// TODO: replace with profile data
const PHOTOS = ["selfie", "room1", "room2"] as const;

const UNDO_ENTER_INITIAL = {
  opacity: 0,
  scale: 0.76,
  x: 0,
  y: 0,
  rotate: 0,
  filter: "blur(12px)",
} as const;

const UNDO_ENTER_ANIMATE = {
  opacity: 1,
  x: 0,
  y: 0,
  scale: 1,
  rotate: 0,
  filter: "blur(0px)",
} as const;

const UNDO_ENTER_TRANSITION = {
  duration: 0.5,
  ease: [0.22, 1, 0.36, 1] as const,
};

const FORWARD_ENTER_INITIAL = (swipeDirection: number) => ({
  opacity: 0,
  x: swipeDirection * 100,
  scale: 0.9,
  rotate: 0,
});

const FORWARD_TRANSITION = { duration: 0.4, ease: "easeInOut" as const };

const UNDO_EXIT = {
  opacity: 0,
  scale: 0.76,
  x: 0,
  y: 0,
  rotate: 0,
  filter: "blur(12px)",
} as const;

const UNDO_EXIT_TRANSITION = {
  duration: 0.45,
  ease: [0.22, 1, 0.36, 1] as const,
};

export function ProfileCard({
  profile,
  isDiscovery,
  handleNext,
  onAccept,
  onPass,
  isFromUndo = false,
  exitFromUndo = false,
  onFromUndoConsumed,
}: {
  profile: DiscoveryProfile | LikedYouProfile;
  isDiscovery: boolean;
  isFromUndo?: boolean;
  exitFromUndo?: boolean;
  onFromUndoConsumed?: () => void;
  // discovery
  handleNext?: () => void;
  // liked-you
  onAccept?: (userId: string) => void;
  onPass?: (userId: string) => void;
}) {
  const [swipeDirection, setSwipeDirection] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const { profile: userProfile } = useUser();
  const fromUndoConsumedRef = useRef(false);

  useEffect(() => {
    fromUndoConsumedRef.current = false;
  }, [profile.user_id]);

  if (isDiscovery)
    console.log(profile?.fname, (profile as DiscoveryProfile)?.match_score);

  // Animation Director
  const onAction = (dir: number) => {
    setSwipeDirection(dir);
    setTimeout(() => {
      if (isDiscovery) {
          if (handleNext) handleNext();
      } else {
        if (dir === 1) {
          if (onAccept) onAccept(profile.user_id);
        } else {
          if (onPass) onPass(profile.user_id);
        }
      }
    }, 10);
  };

  const openLightbox = () => setLightboxOpen(true);
  const closeLightbox = () => setLightboxOpen(false);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen]);

  if (!profile) return <div>Loading...</div>;

  const userPhotos = [
    profile?.avatar_url ?? `/demo/${PHOTOS[photoIndex]}.png`,
    ...(profile?.lifestyle_images ?? []),
  ];

  const nextPhoto = () =>
    setPhotoIndex((i) => (i + 1) % userPhotos.length);
  const prevPhoto = () =>
    setPhotoIndex((i) => (i - 1 + userPhotos.length) % userPhotos.length);

  const showPhotoDots = userPhotos.length > 1;

  return (
    <div className="w-full flex flex-col items-center">
      <AnimatePresence mode="wait" custom={swipeDirection}>
        <motion.div
          key={profile.user_id}
          custom={swipeDirection}
          initial={
            isFromUndo
              ? { ...UNDO_ENTER_INITIAL }
              : FORWARD_ENTER_INITIAL(swipeDirection)
          }
          animate={
            isFromUndo
              ? { ...UNDO_ENTER_ANIMATE }
              : { opacity: 1, x: 0, scale: 1, rotate: 0 }
          }
          exit={
            exitFromUndo
              ? { ...UNDO_EXIT }
              : {
                  x: swipeDirection === 1 ? 1000 : swipeDirection === -1 ? -1000 : 0,
                  opacity: 0,
                  rotate: swipeDirection * 20,
                  scale: 0.8,
                }
          }
          transition={
            isFromUndo
              ? UNDO_ENTER_TRANSITION
              : exitFromUndo
                ? UNDO_EXIT_TRANSITION
                : FORWARD_TRANSITION
          }
          onAnimationComplete={() => {
            if (!isFromUndo || fromUndoConsumedRef.current) return;
            fromUndoConsumedRef.current = true;
            onFromUndoConsumed?.();
          }}
          className="w-4/5 h-[70dvh] md:w-3/4 md:h-[50dvh] md:aspect-video md:max-w-4xl bg-card rounded-3xl border border-border shadow-[0_2px_4px_rgba(0,0,0,0.04),_0_8px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.2),_0_8px_24px_rgba(0,0,0,0.3)] overflow-hidden"
        >
          <div className="flex flex-col md:grid md:grid-cols-12 h-full">
            {/* Photo column */}
            <div className="shrink-0 md:col-span-5 md:flex md:flex-col md:border-r border-border overflow-hidden h-[30vh] md:h-full">
              <div className="relative w-full bg-muted overflow-hidden h-full">
                <Image
                  src={userPhotos[photoIndex]}
                  alt="Profile photo"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-opacity duration-300"
                />

                {/* Click zones: prev | open lightbox | next */}
                <div className="absolute inset-0 flex">
                  <button
                    className="group relative flex-1"
                    onClick={prevPhoto}
                    aria-label="Previous photo"
                  >
                    <span
                      className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{
                        background:
                          "radial-gradient(60% 100% at 0% 50%, rgba(0,0,0,0.45), rgba(0,0,0,0) 60%)",
                      }}
                    />
                  </button>

                  <button
                    className="relative flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      openLightbox();
                    }}
                    aria-label="Open full photo"
                  />

                  <button
                    className="group relative flex-1"
                    onClick={nextPhoto}
                    aria-label="Next photo"
                  >
                    <span
                      className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{
                        background:
                          "radial-gradient(60% 100% at 100% 50%, rgba(0,0,0,0.45), rgba(0,0,0,0) 60%)",
                      }}
                    />
                  </button>
                </div>

                {/* Dot indicators — hidden when only one image (avatar only, no lifestyle photos) */}
                {showPhotoDots && (
                  <div className="absolute bottom-0 left-0 right-0 flex gap-1 px-4 pb-3 pt-8 bg-gradient-to-t from-black/30 to-transparent">
                    {userPhotos.map((_, i) => (
                      <button
                        title={`Photo ${i + 1}`}
                        key={i}
                        type="button"
                        onClick={() => setPhotoIndex(i)}
                        className={`h-0.5 flex-1 rounded-full transition-colors duration-200 ${
                          i === photoIndex ? "bg-white" : "bg-white/40"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Info column */}
            <div className="flex flex-col flex-1 md:col-span-7 overflow-hidden min-h-0">
              <div className="p-4 md:p-6 flex-1 overflow-y-auto min-h-0">
                {/* Bio */}
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-serif font-normal text-foreground tracking-tight">
                      {profile?.fname} {profile?.lname}
                    </h1>
                    <p className="font-serif text-sm text-muted-foreground">
                      Year {profile?.year} •{" "}
                      {profile.majors?.map((m) => m.name).join(" | ")}
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-sm italic text-muted-foreground leading-relaxed">
                  &quot;{profile?.bio}&quot;
                </p>

                <div className="h-px w-full bg-border my-4 md:my-5" />

                <div className="grid grid-cols-2 gap-y-4 md:gap-y-5 gap-x-4">
                  {/* Hobbies & Interests */}
                  <div className="col-span-2">
                    <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-3">
                      Hobbies & interests
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {profile?.hobbies?.map((hobby) => (
                        <span
                          key={hobby.hobby_id}
                          className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs border border-border capitalize"
                        >
                          {hobby.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Preferences / Living Habits */}
                  <div className="col-span-2 gap-y-4 md:gap-y-5 gap-x-4">
                    <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-3">
                      Living habits
                    </h3>
                    <ProfilePreferences
                      preferences={profile?.preferences ?? []}
                      userPreferences={userProfile?.preferences ?? []}
                      maxPrefsToShow={"message" in profile ? 4 : 6}
                    />
                  </div>

                  {/* Their message */}
                  {!isDiscovery && "message" in profile && (
                    <div className="col-span-2">
                      <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-3">
                        Their message to you
                      </h3>
                      <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-3 text-sm text-foreground italic">
                        &quot;{profile?.message}&quot;
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons - Order: Dislike, Like, Message */}
              <div className="px-4 py-1 border-t border-border flex justify-around items-center shrink-0 md:px-7 md:py-4  md:h-16">
                <DislikeButton
                  onClick={() => onAction(-1)}
                  handleNext={() => onAction(-1)}
                  isDiscovery={isDiscovery}
                  targetUserId={profile.user_id}
                />
                <LikeButton
                  onClick={() => onAction(1)}
                  handleNext={() => onAction(1)}
                  isDiscovery={isDiscovery}
                  targetUserId={profile.user_id}
                />
                <MessageButton
                  onClick={() => onAction(1)}
                  handleNext={() => onAction(1)}
                  isDiscovery={isDiscovery}
                  targetUserId={profile.user_id}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative max-w-[95vw] max-h-[95vh]">
            <button
              className="absolute right-2 top-2 z-10 rounded-full bg-black/40 p-2 text-white"
              onClick={(e) => {
                e.stopPropagation();
                closeLightbox();
              }}
              aria-label="Close full photo"
            >
              ✕
            </button>
            <Image
              src={userPhotos[photoIndex]}
              alt="Full photo"
              width={1200}
              height={900}
              className="object-contain max-h-[95vh]"
            />
          </div>
        </div>
      )}
    </div>
  );
}
