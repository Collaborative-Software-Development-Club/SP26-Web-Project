"use client";

import { ThumbsUp } from "lucide-react";
import { useCallback, useEffect } from "react";

export function LikeButton({ handleNext }: { handleNext: () => void }) {
  const handleLike = useCallback(() => {
    console.log("Like");
    handleNext();
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
      className="text-green-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-2 transition-colors cursor-pointer"
    >
      <ThumbsUp />
    </button>
  );
}
