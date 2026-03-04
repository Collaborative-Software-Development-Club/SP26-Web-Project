"use client";

import { useState, useEffect } from "react";
import { UserProfile } from "../types";
import { BookOpen, Cigarette, Cat, Moon, Users, } from "lucide-react";
import { LikeButton } from "./like-button";
import { DislikeButton } from "./dislike-button";
import { MessageButton } from "./message-button";
import Image from "next/image";


// [ready] Icon helper moved outside component for better performance
const getPreferenceIcon = (key: string) => {
  switch (key) {
    case "smoker":
      return <Cigarette className="w-4 h-4" />;
    case "pets":
      return <Cat className="w-4 h-4" />;
    case "sleep_schedule":
      return <Moon className="w-4 h-4" />;
    case "guests":
      return <Users className="w-4 h-4" />;
    default:
      return <BookOpen className="w-4 h-4" />;
  }
};

export function ProfileCard({
  profile,
  handleNext,
}: {
  profile: UserProfile;
  handleNext: () => void;
}) {
  // [ready] Expand state for living habits
  const [isExpanded, setIsExpanded] = useState(false);
  const INITIAL_VISIBLE_PREFS = 2;

  // [dev-only] Combine real and dummy preferences for demonstration
  const allPreferences = profile
    ? [...profile.preferences]
    : [];

  // [ready] Reset expand state when profile changes
  useEffect(() => {
    setTimeout(() => {
      setIsExpanded(false);
    }, 0);
  }, [profile?.user_id]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="w-full bg-zinc-50 dark:bg-black p-4 md:p-8 font-sans flex flex-col items-center">
      {/* [ready] Main Card Container - Strict concise height to prevent resizing */}
      <div className="w-3/4 max-w-4xl bg-white dark:bg-zinc-900 rounded-[2rem] shadow-xl border border-zinc-100 dark:border-zinc-800 overflow-hidden relative md:h-[560px]">
        {/* [ready] Background decoration */}
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-linear-to-br from-indigo-200/30 to-purple-200/30 dark:from-indigo-900/20 dark:to-purple-900/20 blur-3xl rounded-full pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 relative z-10 h-full">
          {/* [ready] Left Column: Media - Flexes to fit the concise card height */}
          <div className="md:col-span-5 flex flex-col p-5 gap-3 border-b md:border-b-0 md:border-r border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-black/20 h-full">
            {/* [ready] Main Image - Uses flex-1 instead of fixed aspect ratio to stay concise */}
            <div className="w-full flex-1 min-h-[300px] md:min-h-0 rounded-2xl overflow-hidden relative shadow-inner bg-zinc-200 dark:bg-zinc-800 group">
              {/* [dev-only] Image logic: Hardcoded for demo, replace with profile.avatar_url */}
              <Image
                src="/demo/selfie.png"
                alt="User Avatar"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>

            {/* [ready] Room Grid - Slightly more compact */}
            <div className="grid grid-cols-2 gap-2 h-24 shrink-0">
              {/* [dev-only] Room logic: Hardcoded for demo, replace with mapped room images */}
              <div className="rounded-xl bg-zinc-200 dark:bg-zinc-800 relative overflow-hidden flex items-center justify-center text-zinc-400">
                <Image
                  src="/demo/room1.png"
                  alt="Room 1"
                  fill
                  sizes="(max-width: 768px) 50vw, 16vw"
                  className="object-cover"
                />
              </div>
              <div className="rounded-xl bg-zinc-200 dark:bg-zinc-800 relative overflow-hidden flex items-center justify-center text-zinc-400">
                <Image
                  src="/demo/room2.png"
                  alt="Room 2"
                  fill
                  sizes="(max-width: 768px) 50vw, 16vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* [ready] Right Column: Details - Strictly contained to prevent card expansion */}
          <div className="w-full md:col-span-7 flex flex-col h-full overflow-hidden">
            {/* [ready] Scrollable Content Area - Expanding habits only scrolls this section */}
            <div className="p-6 flex-1 overflow-y-auto">
              {/* [ready] Header */}
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

              {/* [ready] Bio */}
              <div className="w-full">
                <p className="mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed text-base">
                  &quot;{profile.bio}&quot;
                </p>
              </div>

              <div className="h-px w-full bg-zinc-100 dark:bg-zinc-800 my-5" />

              {/* [ready] Info Grid */}
              <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                <div className="col-span-2">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">
                    Hobbies & Interests
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.hobbies.map((hobby) => (
                      <span
                        key={hobby}
                        className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium border border-zinc-200 dark:border-zinc-700"
                      >
                        {hobby}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="col-span-2">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">
                    Living Habits
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {allPreferences
                      .slice(
                        0,
                        isExpanded
                          ? allPreferences.length
                          : INITIAL_VISIBLE_PREFS,
                      )
                      .map(([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800"
                        >
                          <div className="p-1.5 rounded-full bg-white dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 shadow-sm shrink-0">
                            {getPreferenceIcon(key)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[9px] text-zinc-400 uppercase font-semibold truncate">
                              {key.replace("_", " ")}
                            </p>
                            <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 capitalize truncate">
                              {value}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                  {/* [ready] Expand/Collapse Button */}
                  {allPreferences.length > INITIAL_VISIBLE_PREFS && (
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="mt-2 text-xs font-semibold text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors flex items-center gap-1"
                    >
                      {isExpanded
                        ? "Show Less"
                        : `+${allPreferences.length - INITIAL_VISIBLE_PREFS} More`}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* [ready] Action Buttons - Pinned to bottom, never moves */}
            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-around gap-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md shrink-0">
              <DislikeButton
                handleNext={handleNext}
                isDiscovery={true}
                targetUserId={profile.user_id}
              />
              <MessageButton
                handleNext={handleNext}
                isDiscovery={true}
                targetUserId={profile.user_id}
              />
              <LikeButton
                handleNext={handleNext}
                isDiscovery={true}
                targetUserId={profile.user_id}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
