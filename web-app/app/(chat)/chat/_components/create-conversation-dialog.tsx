"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { createConversationWithCurrentUser, getMatchedUserIds } from "../_actions";

export function CreateConversationDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [matchedUsers, setMatchedUsers] = useState<{ user_id: string; display_name?: string }[]>(
    [],
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setLoading(true);
      setError("");
      getMatchedUserIds()
        .then((users) => {
          setMatchedUsers(users);
        })
        .catch((e) => setError(e instanceof Error ? e.message : "Failed to load users"))
        .finally(() => setLoading(false));
      setSelectedIds(new Set());
    }
  }, [open]);

  function toggleUser(userId: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  }

  async function handleCreate() {
    if (selectedIds.size === 0) {
      setError("Select at least one user");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const memberIds = [...selectedIds];
      const result = await createConversationWithCurrentUser(memberIds);
      const conversation_id = result.conversation_id;

      setOpen(false);
      router.push(`/chat/${conversation_id}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create conversation");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="size-4" />
          New Conversation
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Conversation</DialogTitle>
          <DialogDescription>Select one or more matched users to start a conversation.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 py-4">
          {loading && matchedUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground">Loading matched users...</p>
          ) : matchedUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No matched users yet. Like someone on the Match page to start a conversation.
            </p>
          ) : (
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
              {matchedUsers.map((u) => (
                <button
                  key={u.user_id}
                  type="button"
                  onClick={() => toggleUser(u.user_id)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors hover:bg-muted/50 ${
                    selectedIds.has(u.user_id) ? "border-primary bg-muted" : "border-border"
                  }`}
                >
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded border">
                    {selectedIds.has(u.user_id) ? "✓" : ""}
                  </span>
                  {u.display_name ?? u.user_id}
                </button>
              ))}
            </div>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={loading || selectedIds.size === 0}>
            {loading ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
