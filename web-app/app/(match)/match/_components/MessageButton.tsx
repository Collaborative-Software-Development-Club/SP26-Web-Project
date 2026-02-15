import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquareText } from "lucide-react";

interface Props {
  handleLikeAndSend: () => void;
}

const MessageButton = ({ handleLikeAndSend }: Props) => {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <div className="text-green-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md p-2 transition-colors cursor-pointer">
            <MessageSquareText />
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Send a message</DialogTitle>
            <DialogDescription>Max 100 characters</DialogDescription>
          </DialogHeader>
          <Textarea
            id="message"
            name="message"
            placeholder="Enter your message here"
            rows={4}
            className="resize-none"
            maxLength={100}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose>
              <Button type="submit" onClick={handleLikeAndSend}>
                Like and Send
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default MessageButton;
