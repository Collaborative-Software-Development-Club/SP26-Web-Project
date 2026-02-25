"use client";

import { Undo2 } from "lucide-react";
import { useCallback, useEffect } from "react";
import { undoSwipe } from "../_actions";
import { undoMatchSwipe } from "../_actions";

export function UndoButton({
  handleBefore,
  targetUserId,
  isDiscovery, // true on Discovery page, false on Liked You page
}: {
  handleBefore: () => void;
  targetUserId: string;
  isDiscovery: boolean;
}) {
  const handleUndo = useCallback(() => {
    console.log("Undo");
    handleBefore();
    if (isDiscovery) {
      undoSwipe(targetUserId);
    } else {
      undoMatchSwipe(targetUserId);
    }
  }, [handleBefore, isDiscovery, targetUserId]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "z" || e.key === "Z")) {
        e.preventDefault();
        handleUndo();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleUndo]);

  return (
    <button
      onClick={handleUndo}
      className="text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-2 transition-colors cursor-pointer"
    >
      <Undo2 className="w-10 h-10" />
    </button>
  );
}
