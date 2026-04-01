"use client";

import { saveProfileAction } from "@/app/(profile)/_actions";
import type {
  Hobby,
  HobbyCategoryGroup,
  Preference,
  UserProfile,
} from "@/app/(profile)/types";
import { cn } from "@/lib/utils";
import { useCallback, useState } from "react";
import { AboutStep } from "./about-step";
import {
  emptyProfile,
  STEPS,
  validateAboutStep,
} from "./helpers";
import { HobbiesStep } from "./hobbies-step";
import { PreferencesStep } from "./preferences-step";
import { WizardFooter } from "./wizard-footer";
import { WizardHeader } from "./wizard-header";

export function CreateProfileClient({
  initialHobbiesCatalog,
  initialPreferences,
  catalogError,
}: {
  initialHobbiesCatalog: HobbyCategoryGroup[];
  initialPreferences: Preference[];
  catalogError: string | null;
}) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile>(() => ({
    ...emptyProfile(),
    preferences: initialPreferences,
  }));
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preferenceQuestionIndex, setPreferenceQuestionIndex] = useState(0);

  const update = useCallback(
    <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => {
      setProfile((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const toggleHobby = useCallback((hobby_id: string, name: string) => {
    setProfile((prev) => {
      const exists = prev.hobbies.some((h) => h.hobby_id === hobby_id);
      const next: Hobby[] = exists
        ? prev.hobbies.filter((h) => h.hobby_id !== hobby_id)
        : [...prev.hobbies, { hobby_id, name }];
      return { ...prev, hobbies: next };
    });
  }, []);

  const removeHobby = useCallback((hobby_id: string) => {
    setProfile((prev) => ({
      ...prev,
      hobbies: prev.hobbies.filter((h) => h.hobby_id !== hobby_id),
    }));
  }, []);

  const updatePreference = useCallback(
    (preference_id: string, value: number) => {
      setProfile((prev) => ({
        ...prev,
        preferences: prev.preferences.map((p) =>
          p.preference_id === preference_id ? { ...p, value } : p,
        ),
      }));
    },
    [],
  );

  const totalPrefQuestions = profile.preferences.length;
  const allPreferencesAnswered =
    totalPrefQuestions === 0 ||
    profile.preferences.every((p) => p.value > 0);

  const goPrevStep = () => {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  };

  const goNextStep = () => {
    setError(null);
    if (step === 0) {
      const msg = validateAboutStep(profile);
      if (msg) {
        setError(msg);
        return;
      }
      setStep(1);
      return;
    }
    if (step === 1) {
      setStep(2);
    }
  };

  const goPrevPreferenceQuestion = () => {
    setPreferenceQuestionIndex((i) => Math.max(0, i - 1));
  };

  const goNextPreferenceQuestion = () => {
    setPreferenceQuestionIndex((i) =>
      Math.min(totalPrefQuestions - 1, i + 1),
    );
  };

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const result = await saveProfileAction(profile);
      if (result?.error) setError(result.error);
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isHobbySelected = (hobby_id: string) =>
    profile.hobbies.some((h) => h.hobby_id === hobby_id);

  const prefsError = catalogError;

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-primary/10 via-muted/40 to-background flex items-center justify-center p-4">
      <div
        className={cn(
          "bg-card text-card-foreground border border-border rounded-lg shadow-sm p-8 w-full",
          step === 1
            ? "max-w-2xl"
            : step === 2
              ? "max-w-lg"
              : "max-w-md",
        )}
      >
        <WizardHeader step={step} steps={STEPS} />

        {error && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 text-destructive px-4 py-3 mb-4 text-sm">
            {error}
          </div>
        )}

        {step === 0 && (
          <AboutStep
            profile={profile}
            isSubmitting={isSubmitting}
            update={update}
          />
        )}

        {step === 1 && (
          <HobbiesStep
            profile={profile}
            toggleHobby={toggleHobby}
            removeHobby={removeHobby}
            isHobbySelected={isHobbySelected}
            hobbies={initialHobbiesCatalog}
          />
        )}

        {step === 2 && (
          <PreferencesStep
            profile={profile}
            prefsLoading={false}
            prefsError={prefsError}
            preferenceQuestionIndex={preferenceQuestionIndex}
            isSubmitting={isSubmitting}
            updatePreference={updatePreference}
            onPrevQuestion={goPrevPreferenceQuestion}
            onNextQuestion={goNextPreferenceQuestion}
          />
        )}

        <WizardFooter
          step={step}
          stepsLength={STEPS.length}
          isSubmitting={isSubmitting}
          canCreateProfile={allPreferencesAnswered}
          onPrevStep={goPrevStep}
          onNextStep={goNextStep}
          onSubmit={handleSubmit}
        />
      </div>
    </main>
  );
}
