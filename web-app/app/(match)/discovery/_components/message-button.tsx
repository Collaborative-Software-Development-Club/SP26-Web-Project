"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState, useCallback } from "react";
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
import { saveSwipe } from "../_actions";
import { saveMatchSwipe } from "../_actions";

export function MessageButton({
  handleNext,
  targetUserId,
  isDiscovery, // true on Discovery page, false on Liked You page
}: {
  handleNext: () => void;
  targetUserId: string;
  isDiscovery: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleLikeAndSend = useCallback(() => {
    if (message === "") {
      setError("You cannot send an empty message");
    } else {
      console.log(message);
      handleNext();
      if (isDiscovery) {
        saveSwipe(targetUserId, "like", message);
      } else {
        saveMatchSwipe(targetUserId, "like", message);
      }
      setMessage("");
      setError("");
      setOpen(false);
    }
  }, [message, handleNext, isDiscovery, targetUserId]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.key === "m" || e.key === "M") && !open) {
        e.preventDefault();
        setMessage("");
        setError("");
        setOpen(true);
      }
      if (e.key === "Enter" && !e.shiftKey && open) {
        e.preventDefault();
        handleLikeAndSend();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [open, handleLikeAndSend]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setError("");
      setMessage("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <div className="flex items-center justify-center h-13 w-13 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors cursor-pointer ">
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
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        {error !== "" && <p className="text-red-500 text-sm">{error}</p>}
        <DialogFooter>
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={handleLikeAndSend}>
              Like and Send
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
