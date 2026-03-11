"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/app/(match)/discovery/types";
type ProfilePageProps = {
  profile: UserProfile
}
export default function SettingsPage({profile}: ProfilePageProps) {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="h-full w-full overflow-auto bg-zinc-50 p-8 dark:bg-black">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">

        {/* Page title */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="text-sm text-gray-500">
            Manage your account and preferences
          </p>
        </div>

        {/* Account info */}
        <Card className="border p-6 shadow-sm">
          <div className="space-y-6">

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Account Information
              </h2>
              <p className="text-sm text-gray-500">
                Update your name and email
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="example@osu.edu" />
            </div>

            <div className="flex justify-end">
              <Button className="bg-red-600 hover:bg-red-700">
                Save Changes
              </Button>
            </div>

          </div>
        </Card>

        {/* Password */}
        <Card className="border p-6 shadow-sm">
          <div className="space-y-6">

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Password
              </h2>
              <p className="text-sm text-gray-500">
                Change your account password
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input id="confirm-password" type="password" />
            </div>

            <div className="flex justify-end">
              <Button variant="outline">
                Update Password
              </Button>
            </div>

          </div>
        </Card>

        {/* Preferences */}
        <Card className="border p-6 shadow-sm">
          <div className="space-y-6">

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Preferences
              </h2>
              <p className="text-sm text-gray-500">
                Customize your experience
              </p>
            </div>

            {/* Dark mode toggle */}
            <div className="flex items-center justify-between border rounded-md p-4">
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-gray-500">
                  Enable dark appearance
                </p>
              </div>

              <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
                className="h-5 w-5 cursor-pointer"
              />
            </div>

            {/* Language */}
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>

              <select
                id="language"
                className="w-full rounded-md border border-gray-300 p-2 text-sm"
              >
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>Chinese</option>
              </select>
            </div>

          </div>
        </Card>

        {/* Logout */}
        <Card className="border border-red-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-lg font-semibold text-red-600">
                Log Out
              </h2>
              <p className="text-sm text-gray-500">
                Sign out of your account
              </p>
            </div>

            <Button variant="destructive">
              Log Out
            </Button>

          </div>
        </Card>

      </div>
    </div>
  );
}