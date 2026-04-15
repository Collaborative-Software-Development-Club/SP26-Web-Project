"use client";

import { useState } from "react";
import { DiscoveryProfile, LikedYouProfile } from "../types";
import { ProfilePreferences } from "./profile-preferences";
import { LikeButton } from "./like-button";
import { DislikeButton } from "./dislike-button";
import { MessageButton } from "./message-button";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// TODO: replace with user context
import profiles from "@/mock/profiles.json";
const user = profiles[0];

// TODO: replace with profile data
const PHOTOS = ["selfie", "room1", "room2"] as const;

//refactored from vibecheck-profile, should be able to 
//handle both discovery and liked you profiles with 
//conditional rendering based on props
type MasterProfileProps = {
  profile: DiscoveryProfile | LikedYouProfile;
  isDiscovery?: boolean; // Defaults to true if not provided
  
  // Discovery actions
  handleNext?: () => void;
  handleBefore?: () => void;
  
  // VibeCheck actions
  onAccept?: (userId: string) => void;
  onPass?: (userId: string) => void;
};

export function ProfileCard({
  profile,
  isDiscovery = true, //set default to discovery mode
  handleNext,
  handleBefore,
  onAccept,
  onPass,
}: MasterProfileProps) {
  const [swipeDirection, setSwipeDirection] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);

  // Animation Director
  const onAction = (dir: number) => {
    setSwipeDirection(dir);
    setTimeout(() => {
      if (isDiscovery) {
        //discovery mode actions
        if (dir === 2 && handleBefore) handleBefore();
        else if (handleNext) handleNext();
      } else {
        //vibe check mode actions
        if (dir === 1 && onAccept) onAccept(profile.user_id);
        else if (onPass) onPass(profile.user_id);
        }
    }, 10);
  };

  const nextPhoto = () => setPhotoIndex((i) => (i + 1) % PHOTOS.length);
  const prevPhoto = () =>
    setPhotoIndex((i) => (i - 1 + PHOTOS.length) % PHOTOS.length);

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
                      title="View photo"
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
                    <h1 className="text-3xl font-serif font-normal text-foreground tracking-tight">
                      {profile.fname} {profile.lname}
                    </h1>
                    <p className="font-serif text-sm text-muted-foreground">
                      {profile.majors.map((major) => major.name).join(" | ")} • Year {profile.year}
                    </p>
                  </div>
                </div>

                <div className="w-full">
                  <p className="mt-3 text-sm italic text-muted-foreground leading-relaxed">
                    &quot;{profile.bio}&quot;
                  </p>
                </div>

                <div className="h-px w-full bg-border my-5" />

                <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                  <div className="col-span-2">
                    <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-3">
                      Hobbies & interests
                    </h3>
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

                  <div className="col-span-2">
                    <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-3">
                      Living habits
                    </h3>
                    {/* TODO: Replace with actual user preferences */}
                    <ProfilePreferences
                      preferences={profile.preferences}
                      userPreferences={user.preferences}
                    />
                    {/* NEW: Conditional Message Block */}
                    {!isDiscovery && 'message' in profile && (
                      <>
                        <div className="h-px bg-border my-4" />
                        <div>
                          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-2">
                            Their message to you
                          </p>
                          <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-3 text-sm text-foreground italic">
                            &quot;{profile.message}&quot;
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons - Order: Undo, Dislike, Like, Message */}
              <div className="px-7 py-4 border-t border-border flex justify-around items-center shrink-0">
                <DislikeButton
                  onClick={() => onAction(-1)}
                  handleNext={() => (isDiscovery? handleNext : () => onAction(-1))}
                  isDiscovery={isDiscovery}
                  targetUserId={profile.user_id}
                />
                <LikeButton
                  onClick={() => onAction(1)}
                  handleNext={()=> (isDiscovery? handleNext : () => onAction(1))}
                  isDiscovery={isDiscovery}
                  targetUserId={profile.user_id}
                />
                <MessageButton
                  onClick={() => onAction(1)}
                  handleNext={()=> (isDiscovery? handleNext : () => onAction(1))}
                  isDiscovery={isDiscovery}
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
