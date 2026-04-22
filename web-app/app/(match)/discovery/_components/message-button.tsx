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

export function MessageButton({
  handleNext,
  targetUserId,
  isDiscovery,
  onClick,
}: {
  handleNext: () => void;
  targetUserId: string;
  isDiscovery: boolean;
  onClick?: () => void | Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleLikeAndSend = useCallback(async () => {
    if (message === "") {
      setError("You cannot send an empty message");
      return;
    }
    if (onClick) {
      await Promise.resolve(onClick());
    } else {
      handleNext();
    }
    await saveSwipe(targetUserId, "like", message);
    setMessage("");
    setError("");
    setOpen(false);
  }, [message, handleNext, targetUserId, onClick]);

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
        void handleLikeAndSend();
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
        {isDiscovery ? (
          <div className="flex items-center justify-center h-13 w-13 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors cursor-pointer">
            <MessageSquareText />
          </div>
        ) : (
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-transparent text-foreground text-sm font-medium border-2 border-border hover:bg-muted transition-colors cursor-pointer">
            <MessageSquareText className="w-4 h-4" />
            Respond
          </button>
        )}
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
              {isDiscovery ? "Like and Send" : "Respond"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
