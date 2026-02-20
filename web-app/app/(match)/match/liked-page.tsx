"use client";

import { useState } from "react";
import { VibeCheckProfile } from "./_components/vibecheck-profile";
import type { UserProfile } from "./discovery-page"; // adjust path as needed

// Extend the base profile with the message they sent when vibing with you
export interface IncomingVibe {
  profile: UserProfile;
  message: string;
}

type ActionType = "accepted" | "passed";

interface HistoryEntry {
  vibe: IncomingVibe;
  action: ActionType;
}

export function VibesWithYouPage({
  initialVibes,
}: {
  initialVibes: IncomingVibe[];
}) {
  // Queue of vibes yet to be reviewed
  const [queue, setQueue] = useState<IncomingVibe[]>(initialVibes);

  // Action history – lets us undo the last decision
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Buckets for resolved vibes
  const [accepted, setAccepted] = useState<IncomingVibe[]>([]);
  const [passed, setPassed] = useState<IncomingVibe[]>([]);

  // Optimistic loading guard so buttons can't double-fire
  const [isLoading, setIsLoading] = useState(false);

  // The profile currently on top of the queue
  const current = queue[0] ?? null;

  const handleAccept = async (userId: string) => {
    if (isLoading || !current) return;
    setIsLoading(true);

    // TODO: replace with your real API call, e.g.:
    // await fetch(`/api/vibes/${userId}/accept`, { method: "POST" });

    const resolved = queue[0];
    setQueue((q) => q.slice(1));
    setAccepted((a) => [...a, resolved]);
    setHistory((h) => [...h, { vibe: resolved, action: "accepted" }]);
    setIsLoading(false);
  };

  const handlePass = async (userId: string) => {
    if (isLoading || !current) return;
    setIsLoading(true);

    // TODO: replace with your real API call, e.g.:
    // await fetch(`/api/vibes/${userId}/pass`, { method: "POST" });

    const resolved = queue[0];
    setQueue((q) => q.slice(1));
    setPassed((p) => [...p, resolved]);
    setHistory((h) => [...h, { vibe: resolved, action: "passed" }]);
    setIsLoading(false);
  };

  const handleUndo = () => {
    if (history.length === 0) return;

    const lastEntry = history[history.length - 1];

    // Remove from whichever bucket it landed in
    if (lastEntry.action === "accepted") {
      setAccepted((a) => a.filter((v) => v.profile.user_id !== lastEntry.vibe.profile.user_id));
    } else {
      setPassed((p) => p.filter((v) => v.profile.user_id !== lastEntry.vibe.profile.user_id));
    }

    // Push it back to the front of the queue
    setQueue((q) => [lastEntry.vibe, ...q]);
    setHistory((h) => h.slice(0, -1));
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col items-center min-h-screen py-10 px-4">
      {/* Header */}
      <div className="w-full max-w-lg mb-8 text-center space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Vibe Check
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          {queue.length} {queue.length === 1 ? "person" : "people"} waiting · {accepted.length} matched
        </p>
      </div>

      {/* Main card area */}
      {current ? (
        <div className="w-full max-w-lg">
          <VibeCheckProfile
            profile={current.profile}
            incomingMessage={current.message}
            onAccept={handleAccept}
            onPass={handlePass}
            isLoading={isLoading}
          />
        </div>
      ) : (
        <EmptyState acceptedCount={accepted.length} />
      )}

      {/* Undo button */}
      {history.length > 0 && (
        <button
          onClick={handleUndo}
          className="
            mt-6 flex items-center gap-2
            text-sm text-zinc-500 dark:text-zinc-400
            hover:text-zinc-800 dark:hover:text-white
            transition-colors duration-150
          "
        >
          <span>↩</span>
          <span>
            Undo — bring back{" "}
            <span className="font-semibold">
              {history[history.length - 1]?.vibe.profile.fname}
            </span>
          </span>
        </button>
      )}

      {/* Progress dots */}
      {initialVibes.length > 1 && (
        <div className="mt-6 flex gap-1.5">
          {initialVibes.map((v, i) => {
            const isReviewed = !queue.find(
              (q) => q.profile.user_id === v.profile.user_id,
            );
            const isCurrent = current?.profile.user_id === v.profile.user_id;
            return (
              <span
                key={v.profile.user_id}
                className={`
                  block rounded-full transition-all duration-300
                  ${isCurrent
                    ? "w-4 h-2 bg-black dark:bg-white"
                    : isReviewed
                    ? "w-2 h-2 bg-zinc-300 dark:bg-zinc-600"
                    : "w-2 h-2 bg-zinc-200 dark:bg-zinc-700"
                  }
                `}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function EmptyState({ acceptedCount }: { acceptedCount: number }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
      <span className="text-5xl">✦</span>
      <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">
        {acceptedCount > 0
          ? `You matched with ${acceptedCount} ${acceptedCount === 1 ? "person" : "people"}!`
          : "You're all caught up"}
      </h2>
      <p className="text-sm text-zinc-400 max-w-xs">
        {acceptedCount > 0
          ? "Head to your matches to start chatting."
          : "No new vibes right now. Check back later!"}
      </p>
    </div>
  );
}