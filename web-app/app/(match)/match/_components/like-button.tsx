"use client";

import { ThumbsUp } from "lucide-react";
import { useCallback, useEffect } from "react";
import { saveSwipe } from "../_actions";
import { saveMatchSwipe } from "../_actions";

export function LikeButton({
  handleNext,
  targetUserId,
  discovery, // true on Discovery page, false on Liked You page
}: {
  handleNext: () => void;
  targetUserId: string;
  discovery: boolean;
}) {
  const handleLike = useCallback(() => {
    console.log("Like");
    handleNext();
    if (discovery) {
      saveSwipe(targetUserId, "like", null);
    } else {
      saveMatchSwipe(targetUserId, "like", null);
    }
  }, [handleNext]);

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

  return (
    <button
      onClick={handleLike}
      className="text-green-400 hover:bg-green-100 dark:hover:bg-green-100 rounded-full p-3 transition-colors cursor-pointer"
    >
      <ThumbsUp />
    </button>
  );
}
