"use client";

import { ThumbsDown } from "lucide-react";
import { useCallback, useEffect } from "react";
import { saveSwipe } from "../_actions";
import { saveMatchSwipe } from "../_actions";

export function DislikeButton({
  handleNext,
  targetUserId,
  isDiscovery, // true on Discovery page, false on Liked You page
}: {
  handleNext: () => void;
  targetUserId: string;
  isDiscovery: boolean;
}) {
  const handleDislike = useCallback(() => {
    console.log("Dislike");
    handleNext();
    if (isDiscovery) {
      saveSwipe(targetUserId, "dislike", null);
    } else {
      saveMatchSwipe(targetUserId, "dislike", null);
    }
  }, [handleNext, isDiscovery, targetUserId]);

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

  return (
    <button
      onClick={handleDislike}
      className="text-red-500 hover:bg-red-100 dark:hover:bg-red-800 rounded-full p-3 transition-colors cursor-pointer"
    >
      <ThumbsDown />
    </button>
  );
}
