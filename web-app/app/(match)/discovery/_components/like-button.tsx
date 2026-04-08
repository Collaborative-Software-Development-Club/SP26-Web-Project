"use client";

import { ThumbsUp } from "lucide-react";
import { motion } from "framer-motion";
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
      if (e.key !== "ArrowRight") return;
      const t = e.target;
      if (
        t instanceof HTMLElement &&
        t.closest("textarea, input, select, [contenteditable]")
      )
        return;
      e.preventDefault();
      handleLike();
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleLike]);

  return (
    <motion.button
      onClick={handleLike}
      whileTap={{ scale: 0.85 }}
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="text-green-400 hover:bg-green-100 dark:hover:bg-green-100 rounded-full p-3 transition-colors cursor-pointer"
    >
      <ThumbsUp />
    </motion.button>
  );
}
