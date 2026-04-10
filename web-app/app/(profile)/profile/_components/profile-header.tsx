"use client";
/*Create profile header that displays the name, email, bio, pfp of the user. 
Include ways to be able to edit these fields.
*/
//
import ProfilePage from "./profile-page";
import SettingsPage from "./settings-page";
import PreferencesPage from "./living-habits-page";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { UserProfile } from "@/app/(profile)/types";
import LivingHabitsPage from "./living-habits-page";
//type Page = "profile" | "bio" | "settings";
type ProfilePageProps = {
  profile: UserProfile;
};
export default function ProfileHeader({ profile }: ProfilePageProps) {
  const [page, setPage] = useState("profile");

  return (
    <div className="flex-1 flex flex-row w-full h-full min-h-0">
      <Card className="w-64 rounded-2xl rounded-l-none border border-gray-200 bg-white p-3 shadow-sm">
        <div className="mb-2 px-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Account
          </h2>
        </div>

        <div className="flex flex-col gap-1">
          <Button
            onClick={() => setPage("profile")}
            className={`w-full justify-start rounded-lg px-3 py-2 text-sm shadow-none ${
              page === "profile"
                ? "bg-red-50 text-red-600 hover:bg-red-100"
                : "bg-transparent text-gray-600 hover:bg-gray-100"
            }`}
          >
            Profile
          </Button>


          <Button
            onClick={() => setPage("living-habits")}
            className={`w-full justify-start rounded-lg px-3 py-2 text-sm shadow-none ${
              page === "living-habits"
                ? "bg-red-50 text-red-600 hover:bg-red-100"
                : "bg-transparent text-gray-600 hover:bg-gray-100"
            }`}
          >
            Living Habits
          </Button>

          <Button
            onClick={() => setPage("settings")}
            className={`w-full justify-start rounded-lg px-3 py-2 text-sm shadow-none ${
              page === "settings"
                ? "bg-red-50 text-red-600 hover:bg-red-100"
                : "bg-transparent text-gray-600 hover:bg-gray-100"
            }`}
          >
            Settings
          </Button>

        </div>
      </Card>
      {page === "profile" && <ProfilePage profile={profile} />}
      {page === "living-habits" && <LivingHabitsPage profile={profile} />}
      {page === "settings" && <SettingsPage profile={profile} />}
    </div>
  );
}
