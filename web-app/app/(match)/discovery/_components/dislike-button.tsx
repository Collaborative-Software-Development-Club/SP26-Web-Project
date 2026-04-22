"use client";

import { ThumbsDown } from "lucide-react";
import { motion } from "framer-motion";
import { useCallback, useEffect } from "react";
import { saveSwipe } from "../_actions";

export function DislikeButton({
  handleNext,
  targetUserId,
  onClick,
}: {
  handleNext: () => void;
  targetUserId: string;
  onClick?: () => void | Promise<void>;
}) {
  const handleDislike = useCallback(async () => {
    if (onClick) {
      await Promise.resolve(onClick());
    } else {
      handleNext();
    }
    await saveSwipe(targetUserId, "dislike", null);
  }, [handleNext, targetUserId, onClick]);

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
      void handleDislike();
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
