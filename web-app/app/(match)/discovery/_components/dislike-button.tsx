"use client";

import { ThumbsDown } from "lucide-react";
import { motion } from "framer-motion";
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
      if (e.key !== "ArrowLeft") return;
      const t = e.target;
      if (
        t instanceof HTMLElement &&
        t.closest("textarea, input, select, [contenteditable]")
      )
        return;
      e.preventDefault();
      handleDislike();
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleDislike]);

  return (
    <motion.button
      onClick={handleDislike}
      whileTap={{ scale: 0.85 }}
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="text-red-500 hover:bg-red-100 dark:hover:bg-red-800 rounded-full p-3 transition-colors cursor-pointer"
    >
      <ThumbsDown />
    </motion.button>
  );
}
