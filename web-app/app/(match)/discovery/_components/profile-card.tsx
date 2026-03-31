"use client";

import { useState } from "react";
import { DiscoveryProfile } from "../types";
import { ProfilePreferences } from "./profile-preferences";
import { LikeButton } from "./like-button";
import { UndoButton } from "./undo-button";
import { DislikeButton } from "./dislike-button";
import { MessageButton } from "./message-button";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// TODO: replace with user context
import profiles from "@/mock/profiles.json";
const user = profiles[0];

// TODO: replace with profile data
const PHOTOS = ["selfie", "room1", "room2"] as const;

export function ProfileCard({
  profile,
  handleNext,
  handleBefore,
}: {
  profile: DiscoveryProfile;
  handleNext: () => void;
  handleBefore: () => void;
}) {
  const [swipeDirection, setSwipeDirection] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);

  // Animation Director
  const onAction = (dir: number) => {
    setSwipeDirection(dir);
    setTimeout(() => {
      if (dir === 2) {
        handleBefore();
      } else {
        handleNext();
      }
    }, 10);
  };

  const nextPhoto = () => setPhotoIndex((i) => (i + 1) % PHOTOS.length);
  const prevPhoto = () =>
    setPhotoIndex((i) => (i - 1 + PHOTOS.length) % PHOTOS.length);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="w-full p-4 md:p-8 flex flex-col items-center">
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
          className="w-3/4 max-w-4xl bg-white dark:bg-zinc-900 rounded-[2rem] shadow-xl border border-zinc-100 dark:border-zinc-800 overflow-hidden relative"
        >
          <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-linear-to-br from-indigo-200/30 to-purple-200/30 dark:from-indigo-900/20 dark:to-purple-900/20 blur-3xl rounded-full pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-0 relative z-10 h-full">
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
            {/* Right Column */}
            <div className="w-full md:col-span-7 flex flex-col h-full overflow-hidden">
              <div className="p-6 flex-1 overflow-y-auto">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
                      {profile.fname} {profile.lname}
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 font-medium">
                      {profile.major} • Year {profile.year}
                    </p>
                  </div>
                </div>

                <div className="w-full">
                  <p className="mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed text-base">
                    &quot;{profile.bio}&quot;
                  </p>
                </div>

                <div className="h-px w-full bg-zinc-100 dark:bg-zinc-800 my-5" />

                <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                  <div className="col-span-2">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">
                      Hobbies & Interests
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.hobbies.map((hobby) => (
                        <span
                          key={hobby.hobby_id}
                          className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium border border-zinc-200 dark:border-zinc-700"
                        >
                          {hobby.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">
                      Living Habits
                    </h3>
                    {/* TODO: Replace with actual user preferences */}
                    <ProfilePreferences
                      preferences={profile.preferences}
                      userPreferences={user.preferences}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons - Order: Undo, Dislike, Like, Message */}
              <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-around items-center gap-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md shrink-0">
                <UndoButton
                  onClick={() => onAction(2)}
                  handleBefore={handleBefore}
                  isDiscovery={true}
                  targetUserId={profile.user_id}
                />
                <DislikeButton
                  onClick={() => onAction(-1)}
                  handleNext={handleNext}
                  isDiscovery={true}
                  targetUserId={profile.user_id}
                />
                <LikeButton
                  onClick={() => onAction(1)}
                  handleNext={handleNext}
                  isDiscovery={true}
                  targetUserId={profile.user_id}
                />
                <MessageButton
                  onClick={() => onAction(1)}
                  handleNext={handleNext}
                  isDiscovery={true}
                  targetUserId={profile.user_id}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
