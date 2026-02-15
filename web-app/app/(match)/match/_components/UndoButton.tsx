import { Undo2 } from "lucide-react";

interface Props {
  handleUndo: () => void;
}

const UndoButton = ({ handleUndo }: Props) => {
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
