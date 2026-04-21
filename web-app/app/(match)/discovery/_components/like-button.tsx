"use client";

import { ThumbsUp } from "lucide-react";
import { motion } from "framer-motion";
import { useCallback, useEffect } from "react";
import { saveSwipe } from "../_actions";

export function LikeButton({
  handleNext,
  targetUserId,
  onClick,
}: {
  handleNext: () => void;
  targetUserId: string;
  onClick?: () => void; // Optional callback for additional actions on click
}) {
  const handleLike = useCallback(() => {
    if (onClick) {
      onClick(); // Trigger animation first
    } else {
      handleNext(); // Fallback if no animation logic is passed
    }
    saveSwipe(targetUserId, "like", null);
  }, [handleNext, targetUserId, onClick]);

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
