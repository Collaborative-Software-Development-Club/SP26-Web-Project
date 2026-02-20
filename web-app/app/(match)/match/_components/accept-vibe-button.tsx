"use client";

import { ThumbsUp } from "lucide-react";

interface AcceptVibeButtonProps {
  onAccept: () => void;
  isLoading?: boolean;
}

export function AcceptVibeButton({ onAccept, isLoading }: AcceptVibeButtonProps) {
  return (
    <button
      onClick={onAccept}
      disabled={isLoading}
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
}