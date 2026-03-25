"use client";

import { HistoryProfile } from "../types";
import Image from "next/image";
import { useState, useEffect, useTransition } from "react";
import { clearSwipeHistory } from "../_actions";
import { useRouter } from "next/navigation";
import discoveryProfiles from "@/mock/discover_profiles.json";
import mockIncomingProfiles from "@/mock/profiles.json";

function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
}

export function HistoryClient({
  history,
}: {
  history: HistoryProfile[];
}) {
  const [combinedHistory, setCombinedHistory] = useState<HistoryProfile[]>(history);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleClearHistory = () => {
    // Clear demo memory
    localStorage.removeItem("demoSwipes");
    localStorage.removeItem("demoProfiles");
    
    // Clear server memory
    startTransition(async () => {
      await clearSwipeHistory();
      setCombinedHistory([]);
      router.refresh();
    });
  };

  useEffect(() => {
    // [dev-only] Load demo swipes and mock incoming data into history
    const loadDemoSwipes = () => {
      try {
        const localSwipes = JSON.parse(localStorage.getItem("demoSwipes") || "[]");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mockProfilesMap = new Map((discoveryProfiles as any[]).map((p) => [p.user_id, p]));
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dSwipes = localSwipes.map((s: any) => {
          const p = mockProfilesMap.get(s.target_user_id) || { fname: "Unknown", lname: "" };
          return {
            ...p,
            user_id: s.target_user_id,
            action: s.action,
            message: s.message || "",
            created_at: s.created_at,
            matched: s.matched
          };
        });

        // Generate mock "liked you" events from the 9 demo profiles
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mockLikedYou = mockIncomingProfiles.map((p: any, idx: number) => ({
          ...p,
          action: "liked_you",
          message: "I vibe with you! What housing options on campus are you interested in?",
          // Stagger dates so they show up over the last few days
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * (idx + 1)).toISOString(),
          matched: false
        }));

        // Filter out any mock "liked you" profiles if the user already interacted
        // with them in production history or local demo swipes.
        const existingUserIds = new Set([
          ...history.map((h) => h.user_id),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...dSwipes.map((s: any) => s.user_id)
        ]);

        const unresolvedMockLikedYou = mockLikedYou.filter(p => !existingUserIds.has(p.user_id));

        // Merge real history with demo history, sorted by created_at descending
        const all = [...history, ...dSwipes, ...unresolvedMockLikedYou].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setCombinedHistory(all);
      } catch (e) {
        console.error("Failed to load demo swipes", e);
      }
    };

    loadDemoSwipes();
  }, [history]);

  return (
    <div className="flex flex-col items-center w-full px-4 mb-20 max-w-lg">
      <div className="w-full flex items-center justify-between space-y-1 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Swipe History
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            Your active journey
          </p>
        </div>
        <button 
          onClick={handleClearHistory}
          disabled={isPending || combinedHistory.length === 0}
          className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors border border-red-200"
        >
          {isPending ? "Clearing..." : "Clear History"}
        </button>
      </div>

      {combinedHistory.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-4 w-full">
          {combinedHistory.map((item, idx) => (
            <div
              key={`${item.user_id}-${item.created_at}-${idx}`}
              className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm"
            >
              <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800">
                <Image
                  src={item.avatar_url && !item.avatar_url.includes('example.com') ? item.avatar_url : "/demo/selfie.png"}
                  alt={item.fname || "Profile"}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-zinc-900 dark:text-white truncate">
                    {item.fname} {item.lname}
                  </h3>
                  <span className="text-xs text-zinc-400 whitespace-nowrap ml-2 mt-1">
                    {timeAgo(item.created_at)}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <ActionBadge action={item.action} matched={item.matched} />
                  {item.message && (
                    <span className="text-sm text-zinc-500 truncate mt-1">
                      &quot;{item.message}&quot;
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ActionBadge({ action, matched }: { action: string; matched: boolean }) {
  const actions = action ? action.split(",") : [];
  
  return (
    <div className="flex gap-1 flex-wrap">
      {matched && (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50">
          Matched
        </span>
      )}
      
      {/* We only show "Liked" if it's not matched to avoid redundancy, though could show both based on design preferences */}
      {!matched && actions.includes("like") && (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800/50">
          Liked
        </span>
      )}
      
      {/* Always show "Liked You" to indicate user popularity even on matched/passed */}
      {actions.includes("liked_you") && (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50">
          Liked You
        </span>
      )}
      
      {/* Either direct "pass" or "passed" which means rejected */}
      {(actions.includes("pass") || actions.includes("passed") || actions.includes("dislike")) && (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800/50">
          Passed
        </span>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
      <span className="text-5xl opacity-50">🧭</span>
      <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">
        No History Yet
      </h2>
      <p className="text-sm text-zinc-400 max-w-xs">
        Start exploring profiles to see your history action here!
      </p>
    </div>
  );
}
