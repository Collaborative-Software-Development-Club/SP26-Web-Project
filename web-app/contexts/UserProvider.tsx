"use client";

import type { UserProfile } from "@/app/(profile)/types";
import type { User } from "@supabase/supabase-js";
import type { ReactNode } from "react";
import { UserContext } from "./UserContext";

export default function UserProvider({
  user,
  profile,
  children,
}: {
  user: User | null;
  profile: UserProfile | null;
  children: ReactNode;
}) {
  return (
    <UserContext.Provider value={{ user, profile }}>
      {children}
    </UserContext.Provider>
  );
}
