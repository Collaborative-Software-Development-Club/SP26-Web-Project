"use client";
import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { preferenceQuestion } from "@/lib/constants/preference-question";
import { valueForOptionIndex } from "../create-profile/helpers";

import type { Preference, UserProfile } from "@/app/(profile)/types";
type ProfilePageProps = {
  profile: UserProfile
}

/**
 * Returns whether or not two lists of Preferences are equal.
 * @param p1 The first list of preferences
 * @param p2 The second list of preferences
 * @returns Whether or not they are equal
 */
function prefsEqual(p1: Preference[], p2: Preference[]): boolean {
  return JSON.stringify(p1) === JSON.stringify(p2);
}

export default function LivingHabitsPage({ profile }: ProfilePageProps) {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // The preferences as they are in the database, to see if anything has changed.
  const oldPrefs = profile.preferences;

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
            {formData.preferences.map(pref => {
              
              const entry = preferenceQuestion.get(pref.name);
              if (entry === undefined) {
                return (<div key={`pref-${pref.preference_id}`}>Something went really wrong</div>);
              }
              
              // One group of options
              return (<div key={`pref-${pref.preference_id}`}>
                <Label className="mb-2" htmlFor={pref.preference_id}>{entry.question}</Label>
                <div className="space-y-2 flex flex-col w-75">
                  {/* For every option */}
                  {entry.options.map((opt, i) => {
                    const v = valueForOptionIndex(entry.options, i);
                    const selected = pref.value === v;
                    return (
                      <Button
                        key={`${pref.preference_id}-${opt}`}
                        type="button"
                        variant={selected ? "default" : "outline"}
                        className="capitalize"
                        onClick={() => {
                          // Mutate the form data.
                          setFormData({
                            ...formData, // put all the old shit back in
                            preferences: formData.preferences.map(p => { // modify preferences
                              if (p.preference_id === pref.preference_id) {
                                return { ...p, value: v};
                              } else {
                                return p;
                              }
                            })
                          });
                        }}
                        disabled={isSubmitting}
                      >
                        {opt}
                      </Button>
                    );
                  })}
                  
                </div>
              </div>);
            })}
            <div className="flex justify-end gap-2">
              <Button className="px-6" disabled={prefsEqual(formData.preferences, oldPrefs)} onClick={() => {
                console.log(formData.preferences.map(p=>p.value));
                console.log(oldPrefs.map(p=>p.value));
                
                // Set the form data to what the old preferences were.
                setFormData({
                  ...formData,
                  preferences: oldPrefs.map(p => ({...p})), // bullshit so it mutates and react sees it
                });
                window.scrollTo({ top: -1 });
              }}>
                Undo All Changes
              </Button>
              <Button type="submit" className="px-6" disabled={prefsEqual(formData.preferences, oldPrefs)}>
                Save Changes
              </Button>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}