"use client";

import { ThumbsUp } from "lucide-react";
import { useCallback, useEffect } from "react";
import { saveSwipe } from "../_actions";
import { saveMatchSwipe } from "../_actions";

export function LikeButton({
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
  const handleLike = useCallback(() => {
    console.log("Like");
    
    if (onClick) {
      onClick(); // Trigger animation first
    } else {
      handleNext(); // Fallback if no animation logic is passed
    }

    //Commented out to prevent swipe actions until its ready
    if (isDiscovery) {
      //saveSwipe(targetUserId, "like", null);
    } else {
      //saveMatchSwipe(targetUserId, "like", null);
    }
  }, [handleNext, isDiscovery, targetUserId, onClick]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleLike();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleLike]);

  const DiscoveryButton = () => {
    return (
      <button
        onClick={handleLike}
        className="text-green-400 hover:bg-green-100 dark:hover:bg-green-100 rounded-full p-3 transition-colors cursor-pointer"
      >
        <ThumbsUp />
      </button>
    );
  };

  const LikedYouButton = () => {
    return (
      <button
        onClick={handleLike}
        aria-label="Accept vibe"
        className="
      group relative flex items-center justify-center gap-2
      px-6 py-3 rounded-2xl
      bg-black dark:bg-white
      text-white dark:text-black
      font-semibold text-sm tracking-wide
      shadow-md
      hover:bg-zinc-800 dark:hover:bg-zinc-100
      hover:shadow-lg hover:shadow-black/20
      active:scale-95
      transition-all duration-200
      disabled:opacity-50 disabled:cursor-not-allowed
    "
      >
        <span>Vibe With Them</span>
        <ThumbsUp />
      </button>
    );
  };

  return <>{isDiscovery ? DiscoveryButton() : LikedYouButton()}</>;
}
