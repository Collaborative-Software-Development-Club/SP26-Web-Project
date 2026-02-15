"use client";

import { ThumbsDown } from "lucide-react";
import { useEffect } from "react";

interface Props {
  handleDislike: () => void;
}

const DislikeButton = ({ handleDislike }: Props) => {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handleDislike();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleDislike]);

  return (
    <button
      onClick={handleDislike}
      className="text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md p-2 transition-colors cursor-pointer"
    >
      <ThumbsDown />
    </button>
  );
};

export default DislikeButton;
