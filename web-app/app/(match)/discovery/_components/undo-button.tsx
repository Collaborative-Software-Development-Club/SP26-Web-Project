"use client";

import { useCallback, useEffect } from "react";
import { undoSwipe } from "../_actions";

export function UndoButton({
  handleBefore,
  targetUserId,
  lastEntry,
  onClick,
}: {
  handleBefore: () => void;
  targetUserId: string;
  lastEntry?: string;
  onClick?: () => void | Promise<void>;
}) {
  const handleUndo = useCallback(async () => {
    if (onClick) {
      await Promise.resolve(onClick());
    } else {
      handleBefore();
    }
    await undoSwipe(targetUserId);
  }, [handleBefore, targetUserId, onClick]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key !== "z" && e.key !== "Z") return;
      const t = e.target;
      if (
        t instanceof HTMLElement &&
        t.closest("textarea, input, select, [contenteditable]")
      )
        return;
      e.preventDefault();
      void handleUndo();
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleUndo]);

  return (
    <button
      onClick={handleUndo}
      className="
            flex items-center gap-2
            text-sm text-zinc-500 dark:text-zinc-400
            hover:text-zinc-800 dark:hover:text-white
            transition-colors duration-150
          "
    >
      <span>↩</span>
      <span>
        Undo — bring back <span className="font-semibold">{lastEntry}</span>
      </span>
    </button>
  );
}
