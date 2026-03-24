"use client";

import { HistoryProfile } from "../types";
import Image from "next/image";
import { useState, useEffect } from "react";
import discoveryProfiles from "@/mock/discover_profiles.json";

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
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoSwipes, setDemoSwipes] = useState<HistoryProfile[]>([]);

  useEffect(() => {
    const demo = localStorage.getItem("demoMode") === "true";
    setIsDemoMode(demo);
    if (demo) {
      loadDemoSwipes();
    }
  }, []);

  const loadDemoSwipes = () => {
    const localSwipes = JSON.parse(localStorage.getItem("demoSwipes") || "[]");
    const mockProfilesMap = new Map((discoveryProfiles as any[]).map((p) => [p.user_id, p]));
    
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
    setDemoSwipes(dSwipes);
  };

  const toggleDemoMode = () => {
    const newMode = !isDemoMode;
    setIsDemoMode(newMode);
    localStorage.setItem("demoMode", newMode.toString());
    if (newMode) {
      loadDemoSwipes();
    }
  };

  const clearDemoHistory = () => {
    localStorage.removeItem("demoSwipes");
    setDemoSwipes([]);
  };

  const displayedHistory = isDemoMode ? demoSwipes : history;

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
        

        {/* Toggle for Demo Mode */}
        <div className="flex flex-col items-end gap-1">
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={isDemoMode}
                onChange={toggleDemoMode}
              />
              <div className={`block w-14 h-8 rounded-full transition-colors ${isDemoMode ? 'bg-green-500' : 'bg-gray-300 dark:bg-zinc-700'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isDemoMode ? 'transform translate-x-6' : ''}`}></div>
            </div>
            <div className="ml-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Demo Mode
            </div>
          </label>
          {isDemoMode && demoSwipes.length > 0 && (
            <button 
              onClick={clearDemoHistory}
              className="text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
            >
              Clear demo data
            </button>
          )}
        </div>
      </div>

      {displayedHistory.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-4 w-full">
          {displayedHistory.map((item, idx) => (
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
                    <span className="text-sm text-zinc-500 truncate">
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
  if (matched) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50">
        Matched
      </span>
    );
  }
  
  if (action === "like") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800/50">
        Liked
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800/50">
      Passed
    </span>
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
