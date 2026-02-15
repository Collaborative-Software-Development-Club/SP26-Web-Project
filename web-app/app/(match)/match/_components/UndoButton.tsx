"use client";

import { Undo2 } from "lucide-react";
import { useEffect } from "react";

interface Props {
  handleUndo: () => void;
}

const UndoButton = ({ handleUndo }: Props) => {
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
      className="text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md p-2 transition-colors cursor-pointer"
    >
      <Undo2 />
    </button>
  );
};

export default UndoButton;
