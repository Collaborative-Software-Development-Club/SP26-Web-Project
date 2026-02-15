"use client";

import { ThumbsUp } from "lucide-react";
import { useEffect } from "react";

interface Props {
  handleLike: () => void;
}

const LikeButton = ({ handleLike }: Props) => {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        handleLike();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleLike]);

  return (
    <button
      onClick={handleLike}
      className="text-green-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md p-2 transition-colors cursor-pointer"
    >
      <ThumbsUp />
    </button>
  );
};

export default LikeButton;
