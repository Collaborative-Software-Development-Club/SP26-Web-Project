"use client";

/**
 * Populated once per request from `app/layout.tsx` (server) and passed into
 * `UserProvider`. To see updated data after a profile save, navigate (e.g.
 * `router.push("/profile")`) or call `router.refresh()` so the root layout
 * re-fetches and this provider receives new props.
 */
import type { UserProfile } from "@/app/(profile)/types";
import type { User } from "@supabase/supabase-js";
import { createContext, useContext } from "react";

export type UserContextType = {
  user: User | null;
  profile: UserProfile | null;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  profile: null,
});

/** Supabase auth user from context (or null if signed out). */
export function useAuthUser(): User | null {
  const { user } = useContext(UserContext);
  return user;
}

/** `{ user, profile }` from context — profile is the aggregated view row or null. */
export function useUser(): UserContextType {
  return useContext(UserContext);
}
