'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Cigarette, 
  Cat, 
  Moon, 
  Users, 
  Heart, 
  X, 
} from 'lucide-react';

// [ready] Type definitions matching DB schema
type Preference = [string, string];

interface UserProfile {
  user_id: string;
  is_active: boolean;
  fname: string;
  lname: string;
  gender: string;
  avatar_url: string;
  bio: string;
  major: string;
  year: number;
  created_at: string;
  last_edited_at: string;
  hobbies: string[];
  preferences: Preference[];
}

// [dev-only] Local mock data import
import profilesData from '@/mock/profiles.json';
const profiles: UserProfile[] = profilesData as UserProfile[];

export default function Profile() {
  // [dev-only] Sort for consistent dropdown experience
  const sortedProfiles = [...profiles].sort((a, b) => a.fname.localeCompare(b.fname));

  // [dev-only] State for demo selector
  const [selectedUserId, setSelectedUserId] = useState<string>(sortedProfiles[0]?.user_id || '1');
  
  // [ready] Match score state
  const [matchScore, setMatchScore] = useState<number>(0);

  const currentUser = profiles.find(p => p.user_id === selectedUserId) || profiles[0];
  
  // [dev-only] Check if specific user selected to show demo assets
  const isTopUser = currentUser.user_id === sortedProfiles[0].user_id;

  // [dev-only] Random score generator for demo
  useEffect(() => {
    setMatchScore(Math.floor(Math.random() * (98 - 60 + 1) + 60));
  }, [selectedUserId]);

  // [ready] Icon helper
  const getPreferenceIcon = (key: string) => {
    switch (key) {
      case 'smoker': return <Cigarette className="w-4 h-4" />;
      case 'pets': return <Cat className="w-4 h-4" />;
      case 'sleep_schedule': return <Moon className="w-4 h-4" />;
      case 'guests': return <Users className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  // [ready] Score color helper
  const getMatchColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500 bg-emerald-500/10 border-emerald-200';
    if (score >= 75) return 'text-blue-500 bg-blue-500/10 border-blue-200';
    return 'text-amber-500 bg-amber-500/10 border-amber-200';
  };

  if (!currentUser) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-4 md:p-8 font-sans flex flex-col items-center">
      
      {/* [dev-only] Developer Debug Bar */}
      <div className="w-full max-w-4xl mb-6 p-4 rounded-2xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 flex items-center justify-between shadow-sm">
        <span className="text-sm font-medium text-zinc-500">Developer Preview Mode</span>
        <select 
          className="bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
        >
          {sortedProfiles.map(p => (
            <option key={p.user_id} value={p.user_id}>
              {p.fname} {p.lname} ({p.major})
            </option>
          ))}
        </select>
      </div>

      {/* [ready] Main Card Container */}
      <div className="w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-[2rem] shadow-xl border border-zinc-100 dark:border-zinc-800 overflow-hidden relative">
        
        {/* [ready] Background decoration */}
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-indigo-200/30 to-purple-200/30 dark:from-indigo-900/20 dark:to-purple-900/20 blur-3xl rounded-full pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 relative z-10">
          
          {/* [ready] Left Column: Media */}
          <div className="md:col-span-5 flex flex-col p-6 gap-4 border-b md:border-b-0 md:border-r border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-black/20">
            
            <div className="aspect-[4/5] w-full rounded-2xl overflow-hidden relative shadow-inner bg-zinc-200 dark:bg-zinc-800 group">
                {/* [dev-only] Image logic: Hardcoded for demo, replace with currentUser.avatar_url */}
                {isTopUser ? (
                  <img 
                    src="/demo/selfie.png" 
                    alt="User Avatar" 
                    className="absolute inset-0 w-full h-full object-cover" 
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-zinc-400">
                    <span className="text-sm px-4 text-center">User Avatar Placeholder</span>
                  </div>
                )}
                
                {/* [ready] Status badge */}
                <div className="absolute top-4 left-4 flex gap-2">
                   {currentUser.is_active ? 
                     <span className="px-2 py-1 bg-green-500/90 text-white text-[10px] font-bold uppercase tracking-wider rounded-full backdrop-blur-sm shadow-sm">Active</span> 
                     : 
                     <span className="px-2 py-1 bg-zinc-500/90 text-white text-[10px] font-bold uppercase tracking-wider rounded-full backdrop-blur-sm shadow-sm">Inactive</span>
                   }
                </div>
            </div>

            {/* [ready] Room Grid */}
            <div className="grid grid-cols-2 gap-2 h-32">
               {/* [dev-only] Room logic: Hardcoded for demo, replace with mapped room images */}
               <div className="rounded-xl bg-zinc-200 dark:bg-zinc-800 relative overflow-hidden flex items-center justify-center text-zinc-400">
                  {isTopUser ? (
                    <img src="/demo/room1.png" alt="Room 1" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs">Room 1</span>
                  )}
               </div>
               <div className="rounded-xl bg-zinc-200 dark:bg-zinc-800 relative overflow-hidden flex items-center justify-center text-zinc-400">
                  {isTopUser ? (
                    <img src="/demo/room2.png" alt="Room 2" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs">Room 2</span>
                  )}
               </div>
            </div>
          </div>

          {/* [ready] Right Column: Details */}
          <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-between">
            
            <div>
              {/* [ready] Header */}
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
                    {currentUser.fname} {currentUser.lname}
                  </h1>
                  <p className="text-zinc-500 dark:text-zinc-400 font-medium">
                    {currentUser.major} • Year {currentUser.year}
                  </p>
                </div>
                
                <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl border-[3px] ${getMatchColor(matchScore)} backdrop-blur-sm`}>
                   <span className="text-xl font-bold">{matchScore}%</span>
                   <span className="text-[9px] uppercase font-bold tracking-wide opacity-80">Match</span>
                </div>
              </div>

              {/* [ready] Bio */}
              <p className="mt-4 text-zinc-600 dark:text-zinc-300 leading-relaxed text-lg">
                "{currentUser.bio}"
              </p>

              <div className="h-px w-full bg-zinc-100 dark:bg-zinc-800 my-6" />

              {/* [ready] Info Grid */}
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                
                <div className="col-span-2">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Hobbies & Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentUser.hobbies.map((hobby) => (
                      <span key={hobby} className="px-4 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-medium border border-zinc-200 dark:border-zinc-700">
                        {hobby}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="col-span-2">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Living Habits</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {currentUser.preferences.map(([key, value]) => (
                      <div key={key} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                        <div className="p-2 rounded-full bg-white dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 shadow-sm">
                          {getPreferenceIcon(key)}
                        </div>
                        <div>
                           <p className="text-[10px] text-zinc-400 uppercase font-semibold">{key.replace('_', ' ')}</p>
                           <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 capitalize">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* [ready] Action Buttons */}
            <div className="flex gap-4 mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800">
               <button className="flex-1 py-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2">
                 <X className="w-5 h-5" />
                 <span>Pass</span>
               </button>
               <button className="flex-[2] py-4 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                 <Heart className="w-5 h-5 fill-current" />
                 <span>Match</span>
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
