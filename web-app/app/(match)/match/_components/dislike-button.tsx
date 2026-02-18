"use client";

import { ThumbsDown } from "lucide-react";
import { useCallback, useEffect } from "react";

export function DislikeButton({ handleNext }: { handleNext: () => void }) {
  const handleDislike = useCallback(() => {
    console.log("Dislike");
    handleNext();
  }, [handleNext]);

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
