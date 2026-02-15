import { ThumbsUp } from "lucide-react";

interface Props {
  handleLike: () => void;
}

const LikeButton = ({ handleLike }: Props) => {
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
