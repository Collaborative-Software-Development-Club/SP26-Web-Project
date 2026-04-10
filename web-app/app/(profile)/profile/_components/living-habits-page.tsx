"use client";
import majors from "@/mock/majors.json";
import hobbies from "@/mock/hobbies.json";
import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { preferenceQuestion } from "@/lib/constants/preference-question";

import type { UserProfile } from "@/app/(profile)/types";
type ProfilePageProps = {
  profile: UserProfile
}
export default function LivingHabitsPage({ profile }: ProfilePageProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(profile);


  return (
    <div className="h-full w-full overflow-auto bg-zinc-50 p-8 dark:bg-black">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">

        {/* Page title */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Living Habits
          </h1>
          <p className="text-sm text-gray-500">
            Update your living habits
          </p>
          <p className="test-sm text-gray-400">
            <sub>
              Others will be able to filter you based on your choices.
            </sub>
          </p>
        </div>

        {/*Email*/}
        <Card className="border p-6 shadow-sm">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Habits
            </h2>
            {/* <p className="text-sm text-gray-500">
              Your habits
            </p> */}
          </div>

          <div className="space-y-6">
            {profile.preferences.map(pref => {
              function onChange() {}
              
              const entry = preferenceQuestion.get(pref.name);
              if (entry === undefined) {
                return (<div key={`pref-${pref.preference_id}`}>Something went really wrong</div>);
              }
              
              return (<>
                <div key={`pref-${pref.preference_id}`} className="space-y-2">
                  <Label htmlFor={pref.preference_id}>{entry.question}</Label>
                  <Input id={pref.preference_id} defaultValue={pref.value} onChange={onChange}></Input>
                </div>
              </>);
            })}
            <div className="flex justify-end">
              <Button type="submit" className="px-6">
                Save Changes
              </Button>
            </div>
          </div>

          {/* <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" />
            </div>

          </div> */}
        </Card>

      </div>
    </div>
  );
}