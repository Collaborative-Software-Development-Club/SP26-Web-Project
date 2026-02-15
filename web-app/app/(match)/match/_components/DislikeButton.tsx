import { ThumbsDown } from "lucide-react";

interface Props {
  handleDislike: () => void;
}

const DislikeButton = ({ handleDislike }: Props) => {
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
