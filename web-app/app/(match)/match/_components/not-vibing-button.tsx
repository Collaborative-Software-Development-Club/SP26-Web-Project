"use client";

import { ThumbsDown } from "lucide-react";

interface VibePassedButtonProps {
  onPass: () => void;
  isLoading?: boolean;
}

export function VibePassedButton({ onPass, isLoading }: VibePassedButtonProps) {
  return (
    <button
      onClick={onPass}
      disabled={isLoading}
      aria-label="Not vibing"
      className="
        group relative flex items-center justify-center gap-2
        px-6 py-3 rounded-2xl
        bg-white dark:bg-zinc-900
        border-2 border-zinc-200 dark:border-zinc-700
        text-zinc-500 dark:text-zinc-400
        font-semibold text-sm tracking-wide
        shadow-sm
        hover:border-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30
        active:scale-95
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
      "
    >
      <span>Not Vibing</span>
      <ThumbsDown />
    </button>
  );
}