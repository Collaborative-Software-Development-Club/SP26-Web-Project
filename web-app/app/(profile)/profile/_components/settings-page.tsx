"use client";
import majors from "@/mock/majors.json";
import hobbies from "@/mock/hobbies.json";
import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent,SelectTrigger,SelectValue, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { UserProfile } from "@/app/(profile)/types";

export function SettingsPage({profile}: {profile: UserProfile}) {
  const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(profile);

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

      {/*Email*/}
      <Card className="border p-6 shadow-sm">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Email & Phone
            </h2>
            <p className="text-sm text-gray-500">
              Change your contact information
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email"/>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone"/>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="px-6">
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

      </div>
    </div>
  );
}