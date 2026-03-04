"use client";

import { Undo2 } from "lucide-react";
import { useCallback, useEffect } from "react";
import { undoSwipe } from "../_actions";
import { undoMatchSwipe } from "../_actions";

export function UndoButton({
  handleBefore,
  targetUserId,
  isDiscovery, // true on Discovery page, false on Liked You page
  lastEntry,
  onClick,
}: {
  handleBefore: () => void;
  targetUserId: string;
  isDiscovery: boolean;
  lastEntry?: string;
  onClick?: () => void; // Optional callback for additional actions on click
}) {
  const handleUndo = useCallback(() => {
    console.log("Undo");
    
    if (onClick) {
      onClick(); 
    } else {
      // Fallback if used elsewhere without animation logic
      handleBefore();
    }

    //Commented out to prevent undo actions until its ready
    if (isDiscovery) {
      //undoSwipe(targetUserId);
    } else {
      //undoMatchSwipe(targetUserId);
    }
  }, [handleBefore, isDiscovery, targetUserId, onClick]);

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
  const DiscoveryButton = () => {
    return (
      <button
        onClick={handleUndo}
        className="text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-2 transition-colors cursor-pointer"
      >
        <Undo2 className="w-8 h-8" />
      </button>
    );
  };

  const LikedYouButton = () => {
    return (
      <button
        onClick={handleUndo}
        className="
            mt-6 flex items-center gap-2
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
  };

  return <>{isDiscovery ? DiscoveryButton() : LikedYouButton()}</>;
}
