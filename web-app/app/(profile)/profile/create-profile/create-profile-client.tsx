"use client";

import { saveProfileAction } from "@/app/(profile)/_actions";
import type {
  Hobby,
  HobbyCategoryGroup,
  Major,
  Preference,
  UserProfile,
} from "@/app/(profile)/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { AboutStep } from "./about-step";
import {
  emptyProfile,
  MAX_HOBBIES,
  MAX_MAJORS,
  STEPS,
  validateAboutStep,
  validateHobbiesStep,
} from "./helpers";
import { HobbiesStep } from "./hobbies-step";
import { PreferencesStep } from "./preferences-step";
import { WizardFooter } from "./wizard-footer";
import { WizardHeader } from "./wizard-header";

export function CreateProfileClient({
  initialMajors,
  initialHobbiesCatalog,
  initialPreferences,
  catalogError,
}: {
  initialMajors: Major[];
  initialHobbiesCatalog: HobbyCategoryGroup[];
  initialPreferences: Preference[];
  catalogError: string | null;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile>(() => ({
    ...emptyProfile(),
    preferences: initialPreferences,
    majors: [],
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

  const toggleMajor = useCallback((major: Major) => {
    setProfile((prev) => {
      const exists = prev.majors.some(
        (m) => String(m.major_id) === String(major.major_id),
      );
      if (!exists && prev.majors.length >= MAX_MAJORS) return prev;
      const next: Major[] = exists
        ? prev.majors.filter(
            (m) => String(m.major_id) !== String(major.major_id),
          )
        : [...prev.majors, { ...major, major_id: String(major.major_id) }];
      return { ...prev, majors: next };
    });
  }, []);

  const toggleHobby = useCallback((hobby_id: string, name: string) => {
    setProfile((prev) => {
      const exists = prev.hobbies.some((h) => h.hobby_id === hobby_id);
      if (!exists && prev.hobbies.length >= MAX_HOBBIES) return prev;
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
      const msg = validateHobbiesStep(profile);
      if (msg) {
        setError(msg);
        return;
      }
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
      if (result && "error" in result) {
        setError(result.error);
        return;
      }
      router.push("/profile");
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
    <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 via-muted/40 to-background p-4">
      <Card
        className={cn(
          "flex w-full max-h-[80vh] flex-col gap-0 overflow-hidden py-0 shadow-sm",
          step === 1
            ? "max-w-2xl"
            : step === 2
              ? "max-w-lg"
              : "max-w-md",
        )}
      >
        <CardHeader className="shrink-0 border-b pb-6">
          <WizardHeader step={step} steps={STEPS} />
        </CardHeader>

        <CardContent className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto py-6">
          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {step === 0 && (
            <AboutStep
              profile={profile}
              majorsCatalog={initialMajors}
              isSubmitting={isSubmitting}
              update={update}
              toggleMajor={toggleMajor}
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
        </CardContent>

        <CardFooter className="shrink-0 border-t pt-6">
          <WizardFooter
            step={step}
            stepsLength={STEPS.length}
            isSubmitting={isSubmitting}
            canCreateProfile={allPreferencesAnswered}
            onPrevStep={goPrevStep}
            onNextStep={goNextStep}
            onSubmit={handleSubmit}
          />
        </CardFooter>
      </Card>
    </div>
  );
}
