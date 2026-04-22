"use client";

import { ProfilePage } from "./profile-page";
import { SettingsPage } from "./settings-page";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { UserProfile } from "@/app/(profile)/types";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Settings, User } from "lucide-react";

type ProfilePageProps = {
  profile: UserProfile;
};

export function ProfileHeader({ profile }: ProfilePageProps) {
  const [page, setPage] = useState("profile");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navButtonClass = (active: boolean) =>
    cn(
      "w-full justify-start gap-3 rounded-lg px-3 py-2 text-sm shadow-none",
      active
        ? "bg-red-50 text-red-600 hover:bg-red-100"
        : "bg-transparent text-gray-600 hover:bg-gray-100",
    );

  const navIconButtonClass = (active: boolean) =>
    cn(
      "size-10 justify-center rounded-lg p-0 shadow-none",
      active
        ? "bg-red-50 text-red-600 hover:bg-red-100"
        : "bg-transparent text-gray-600 hover:bg-gray-100",
    );

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col md:flex-row">
      <div className="flex shrink-0 border-b border-gray-200 bg-white md:hidden">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setPage("profile")}
          className={cn(
            "h-11 flex-1 rounded-none border-b-2 border-transparent text-sm font-medium",
            page === "profile"
              ? "border-red-500 text-red-600"
              : "text-gray-600",
          )}
        >
          Profile
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => setPage("settings")}
          className={cn(
            "h-11 flex-1 rounded-none border-b-2 border-transparent text-sm font-medium",
            page === "settings"
              ? "border-red-500 text-red-600"
              : "text-gray-600",
          )}
        >
          Settings
        </Button>
      </div>

      <Card
        className={cn(
          "hidden shrink-0 flex-col border border-gray-200 bg-white shadow-sm transition-[width] duration-200 ease-out md:flex",
          "rounded-2xl rounded-l-none",
          sidebarCollapsed ? "w-14 p-2" : "w-52 p-3 lg:w-64",
        )}
      >
        <div
          className={cn(
            "mb-2 flex items-center gap-1",
            sidebarCollapsed ? "justify-center" : "justify-between",
          )}
        >
          {!sidebarCollapsed && (
            <h2 className="truncate px-1 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Account
            </h2>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 shrink-0 text-gray-500 hover:text-gray-900"
            onClick={() => setSidebarCollapsed((c) => !c)}
            title={sidebarCollapsed ? "Expand menu" : "Collapse menu"}
            aria-expanded={!sidebarCollapsed}
            aria-label={sidebarCollapsed ? "Expand menu" : "Collapse menu"}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="size-4" />
            ) : (
              <ChevronLeft className="size-4" />
            )}
          </Button>
        </div>

        <div className="flex flex-col gap-1">
          <Button
            type="button"
            onClick={() => setPage("profile")}
            className={cn(
              sidebarCollapsed ? navIconButtonClass(page === "profile") : navButtonClass(page === "profile"),
            )}
            title="Profile"
          >
            {sidebarCollapsed ? (
              <>
                <User className="size-4 shrink-0" />
                <span className="sr-only">Profile</span>
              </>
            ) : (
              "Profile"
            )}
          </Button>

          <Button
            type="button"
            onClick={() => setPage("settings")}
            className={cn(
              sidebarCollapsed ? navIconButtonClass(page === "settings") : navButtonClass(page === "settings"),
            )}
            title="Settings"
          >
            {sidebarCollapsed ? (
              <>
                <Settings className="size-4 shrink-0" />
                <span className="sr-only">Settings</span>
              </>
            ) : (
              "Settings"
            )}
          </Button>
        </div>
      </Card>

      <div className="min-h-0 flex-1 overflow-auto">
        {page === "profile" && <ProfilePage profile={profile} showEditFeatures={true} />}
        {page === "settings" && <SettingsPage />}
      </div>
    </div>
  );
}
