"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LikeButton } from "./like-button";
import { DislikeButton } from "./dislike-button";
import { LikedYouProfile, YesNoPreferences } from "../types";
import Image from "next/image";

export function VibeCheckProfile({
  profile,
  onAccept,
  onPass,
}: {
  profile: LikedYouProfile;
  onAccept: (userId: string) => void;
  onPass: (userId: string) => void;
}) {
  const [replyText, setReplyText] = useState("");
  const [swipeDirection, setSwipeDirection] = useState(0);

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

  useEffect(() => {
    setSwipeDirection(0);
  }, [profile.user_id]);

  const yearLabel: Record<number, string> = {
    1: "Freshman",
    2: "Sophomore",
    3: "Junior",
    4: "Senior",
    5: "Graduate",
  };

  return (
    <div className="w-full flex justify-center">
      <AnimatePresence mode="wait" custom={swipeDirection}>
        <motion.div
          key={profile.user_id}
          custom={swipeDirection}
          initial={{
            opacity: 0,
            x: swipeDirection === 1 ? 100 : swipeDirection === -1 ? -100 : 0,
            scale: 0.98,
          }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{
            x: swipeDirection === 1 ? 500 : swipeDirection === -1 ? -500 : 0,
            opacity: 0,
            rotate: swipeDirection * 10,
            scale: 0.8,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="w-full max-w-lg rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-black/5"
        >
          {/* Avatar & header */}
          <div className="relative h-52 bg-zinc-100 dark:bg-zinc-800">
            <Image
              src="/demo/selfie.png"
              alt="User Avatar"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-br from-black/30 to-transparent" />
            <div className="absolute bottom-4 left-5 right-5">
              <h2 className="text-white text-2xl font-bold leading-tight">
                {profile.fname} {profile.lname}
              </h2>
              <p className="text-white/75 text-sm">
                {yearLabel[profile.year] ?? `Year ${profile.year}`} ·{" "}
                {profile.major}
              </p>
            </div>
          </div>
          <div className="p-5 space-y-4">

        {/* Bio */}
        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
          {profile.bio}
        </p>

        {/* Hobbies */}
        {profile.hobbies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {profile.hobbies.map((hobby) => (
              <span
                key={hobby}
                className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-medium"
              >
                {hobby}
              </span>
            ))}
          </div>
        )}

        {/* Preferences */}
        {profile.preferences.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {profile.preferences.map((pref) => (
              <div
                key={pref.name}
                className="flex items-center gap-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 px-3 py-2"
              >
                <span className="text-xs text-zinc-400 dark:text-zinc-500 capitalize">
                  {pref.name}
                </span>
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-200 ml-auto">
                  {YesNoPreferences.includes(pref.name)
                    ? pref.value === 1
                      ? "Yes"
                      : "No"
                    : pref.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-zinc-100 dark:border-zinc-800" />

        {/* Incoming message */}
        <div className="space-y-1">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Their message to you
          </p>
          <div className="rounded-2xl rounded-tl-sm bg-zinc-100 dark:bg-zinc-800 px-4 py-3 text-sm text-zinc-700 dark:text-zinc-200 italic">
            &quot;{profile.message}&quot;
          </div>
        </div>

        {/* Reply box */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Your reply (optional)
          </p>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={`Reply to ${profile.fname}...`}
            rows={3}
            className="
              w-full resize-none rounded-2xl px-4 py-3
              bg-zinc-50 dark:bg-zinc-800
              border border-zinc-200 dark:border-zinc-700
              text-sm text-zinc-800 dark:text-zinc-100
              placeholder:text-zinc-400
              focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white
              transition
            "
          />
        </div>

        {/* Action buttons */}
        <div className="flex flex-row justify-around gap-3 pt-1">
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
        </div>
      </div>
    </motion.div>
  </AnimatePresence>
</div>
  );
}
