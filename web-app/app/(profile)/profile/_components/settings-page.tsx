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
type ProfilePageProps = {
  profile: UserProfile
}
export default function SettingsPage({profile}: ProfilePageProps) {
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

        {/* Account info */}
        {/*
        <Card className="w-full max-w-4xl rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Edit Profile</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={(e)=>handleSubmitProfile(e)} className="space-y-6">
            {err && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {err}
              </div>
            )}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.fname}
                  onChange={(e) => handleChange("fname", e.target.value)}
                  placeholder="Enter your first name"
                  className="shadow-md"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lname}
                  onChange={(e) => handleChange("lname", e.target.value)}
                  placeholder="Enter your last name"
                  className="shadow-md"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Major</Label>
              <Select
                value={formData.majors?.map((m)=>m.name).join(" | ")}
                onValueChange={(value) => handleChange("major", value)}
              >
                <SelectTrigger className="w-full shadow-md">
                  <SelectValue placeholder="Select your major" />
                </SelectTrigger>
                <SelectContent>
                  {majors.Majors.map((major) => (
                    <SelectItem key={major} value={major}>
                      {major}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                placeholder="Write a little about yourself..."
                className="shadow-md"
              />
            </div>

            <div className="space-y-4">
              <Label>Hobbies</Label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2 bg-gray-100 rounded-md">
                {/*Object.entries(hobbies).map(([category, list]) => (
                  <div key={category} className="space-y-3">
                    <h2 className="text-sm font-semibold text-muted-foreground">
                      {category}
                    </h2>

                    <div className="grid grid-cols-2 gap-2 border-2 rounded-md p-2 border-gray-300 shadow-md bg-white">
                      {list.map((hobby: string) => (
                        <Label
                          key={hobby}
                          className="flex items-center gap-2 text-sm cursor-pointer"
                        >
                          <Input
                            type="checkbox"
                            className="h-4 w-4"
                            value={hobby}
                          />
                          {hobby}
                        </Label>
                      )}
                    </div>
                  </div>
                ))
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="px-6">
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      */}

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