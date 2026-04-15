"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProfilePreferences } from "./profile-preferences";
import { LikeButton } from "./like-button";
import { DislikeButton } from "./dislike-button";
import { MessageButton } from "./message-button";
import { LikedYouProfile } from "../types";
import Image from "next/image";

// TODO: replace with user context
import profiles from "@/mock/profiles.json";
const user = profiles[0];

// TODO: replace with profile data
const PHOTOS = ["selfie", "room1", "room2"] as const;

export function VibeCheckProfile({
  profile,
  onAccept,
  onPass,
}: {
  profile: LikedYouProfile;
  onAccept: (userId: string) => void;
  onPass: (userId: string) => void;
}) {
  const [swipeDirection, setSwipeDirection] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);

  const onAction = (dir: number) => {
    setSwipeDirection(dir);
    setTimeout(() => {
      if (dir === 1) {
        onAccept(profile.user_id);
      } else {
        onPass(profile.user_id);
      }
    }, 10);
  };

  const nextPhoto = () => setPhotoIndex((i) => (i + 1) % PHOTOS.length);
  const prevPhoto = () =>
    setPhotoIndex((i) => (i - 1 + PHOTOS.length) % PHOTOS.length);

  const yearLabel: Record<number, string> = {
    1: "Freshman",
    2: "Sophomore",
    3: "Junior",
    4: "Senior",
    5: "Graduate",
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="w-full flex flex-col items-center">
      <AnimatePresence mode="wait" custom={swipeDirection}>
        <motion.div
          key={profile.user_id}
          custom={swipeDirection}
          initial={{
            opacity: 0,
            x: swipeDirection === 2 ? -500 : swipeDirection * 100,
            scale: swipeDirection === 2 ? 1.1 : 0.9,
          }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{
            x: swipeDirection === 1 ? 1000 : swipeDirection === -1 ? -1000 : 0,
            opacity: 0,
            rotate: swipeDirection * 20,
            scale: 0.8,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="w-3/4 max-w-4xl bg-card rounded-3xl border border-border shadow-[0_2px_4px_rgba(0,0,0,0.04),_0_8px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.2),_0_8px_24px_rgba(0,0,0,0.3)] overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-0 h-full">
            {/* Left Column */}
            <div className="md:col-span-5 flex flex-col border-b md:border-b-0 md:border-r border-border overflow-hidden">
              {/* Photo viewer */}
              <div className="relative aspect-[3/4] w-full bg-muted overflow-hidden">
                <Image
                  src={`/demo/${PHOTOS[photoIndex]}.png`}
                  alt="Profile photo"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-opacity duration-300"
                />

                {/* Click zones for prev / next */}
                <div className="absolute inset-0 flex">
                  <div className="flex-1 cursor-pointer" onClick={prevPhoto} />
                  <div className="flex-1 cursor-pointer" onClick={nextPhoto} />
                </div>

                {/* Dot indicators */}
                <div className="absolute bottom-0 left-0 right-0 flex gap-1 px-4 pb-3 pt-8 bg-gradient-to-t from-black/30 to-transparent">
                  {PHOTOS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPhotoIndex(i)}
                      className={`h-0.5 flex-1 rounded-full transition-colors duration-200 ${
                        i === photoIndex ? "bg-white" : "bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right column — info */}
            <div className="md:col-span-7 flex flex-col overflow-hidden">
              <div className="p-6 flex-1 overflow-y-auto scrollbar-hide flex flex-col gap-4">
                {/* Name + meta */}
                <div>
                  <h1 className="text-3xl font-serif font-normal text-foreground tracking-tight">
                    {profile.fname} {profile.lname}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    {profile.majors.map((major) => major.name).join(" | ")} • Year {profile.year}
                  </p>
                </div>

                {/* Bio */}
                <p className="text-sm italic text-muted-foreground leading-relaxed">
                  &quot;{profile.bio}&quot;
                </p>

                <div className="h-px bg-border" />

                {/* Hobbies */}
                {profile.hobbies.length > 0 && (
                  <div>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-3">
                      Hobbies & interests
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {profile.hobbies.map((hobby) => (
                        <span
                          key={hobby.hobby_id}
                          className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs border border-border"
                        >
                          {hobby.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Living habits */}
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-3">
                    Living habits
                  </p>
                  <ProfilePreferences
                    preferences={profile.preferences}
                    userPreferences={user.preferences}
                  />
                </div>

                <div className="h-px bg-border" />

                {/* Their message */}
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-2">
                    Their message to you
                  </p>
                  <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-3 text-sm text-foreground italic">
                    &quot;{profile.message}&quot;
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="px-7 py-4 border-t border-border flex justify-around items-center shrink-0">
                <DislikeButton
                  onClick={() => onAction(-1)}
                  handleNext={() => onAction(-1)}
                  targetUserId={profile.user_id}
                  isDiscovery={false}
                />
                <LikeButton
                  onClick={() => onAction(1)}
                  handleNext={() => onAction(1)}
                  targetUserId={profile.user_id}
                  isDiscovery={false}
                />
                <MessageButton
                  onClick={() => onAction(1)}
                  handleNext={() => onAction(1)}
                  targetUserId={profile.user_id}
                  isDiscovery={false}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
