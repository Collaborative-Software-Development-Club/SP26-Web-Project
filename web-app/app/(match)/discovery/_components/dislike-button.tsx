"use client";

import { ThumbsDown } from "lucide-react";
import { useCallback, useEffect } from "react";
import { saveSwipe } from "../_actions";
import { saveMatchSwipe } from "../_actions";

export function DislikeButton({
  handleNext,
  targetUserId,
  isDiscovery, // true on Discovery page, false on Liked You page
  onClick,
}: {
  handleNext: () => void;
  targetUserId: string;
  isDiscovery: boolean;
  onClick?: () => void; // Optional callback for additional actions on click
}) {
  const handleDislike = useCallback(() => {
    console.log("Dislike");
    
    if (onClick) {
      onClick(); // Trigger animation first
    } else {
      handleNext(); // Fallback if no animation logic is passed
    }

    //Commented out to prevent dislike actions until its ready
    if (isDiscovery) {
      //saveSwipe(targetUserId, "dislike", null);
    } else {
      //saveMatchSwipe(targetUserId, "dislike", null);
    }
  }, [handleNext, isDiscovery, targetUserId, onClick]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handleDislike();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleDislike]);

  const DiscoveryButton = () => {
    return (
      <button
        onClick={handleDislike}
        className="text-red-500 hover:bg-red-100 dark:hover:bg-red-800 rounded-full p-3 transition-colors cursor-pointer"
      >
        <ThumbsDown />
      </button>
    );
  };

  const LikedYouButton = () => {
    return (
      <button
        onClick={handleDislike}
        aria-label="Not vibing"
        className="
      group relative flex items-center justify-center gap-2
      px-6 py-3 rounded-2xl
      bg-white dark:bg-zinc-900
      border-2 border-zinc-200 dark:border-zinc-700
      text-zinc-500 dark:text-zinc-400
      font-semibold text-sm tracking-wide
      shadow-sm
      hover:border-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30
      active:scale-95
      transition-all duration-200
      disabled:opacity-50 disabled:cursor-not-allowed
    "
      >
        <span>Pass On Vibe</span>
        <ThumbsDown />
      </button>
    );
  };
  return <>{isDiscovery ? DiscoveryButton() : LikedYouButton()}</>;
}
