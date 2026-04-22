import { Card, CardHeader, CardContent } from "@/components/ui/card";
import type { UserProfile } from "@/app/(profile)/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  getPreferenceDisplayLabel,
  getPreferenceIcon,
} from "@/app/(profile)/profile/_components/preference-display";

const CARD_SHADOW =
  "shadow-[0_2px_4px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.2),0_8px_24px_rgba(0,0,0,0.3)]";

export function ProfilePage({ profile }: { profile: UserProfile }) {
  const user = profile;
  const lifestyleImages = user.lifestyle_images && user.lifestyle_images.length > 0
    ? user.lifestyle_images
    : ["/demo/room1.png", "/demo/room2.png"];
  const year = ["1st", "2nd", "3rd", "4th", "5th"];

  const cardSurface =
    `overflow-hidden rounded-2xl border border-border bg-card sm:rounded-3xl ${CARD_SHADOW}`;

  return (
    <Card className="h-full w-full overflow-auto rounded-none border-none bg-background p-3 shadow-none sm:p-5 md:p-6 lg:p-8 pb-0">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:gap-5 lg:gap-6">
        {/* Profile hero */}
        <Card className={cardSurface}>
          <div className="flex flex-wrap items-center justify-end gap-2 px-3 sm:gap-3 sm:px-5 md:px-6 lg:gap-4">
            <Badge
              variant="secondary"
              className="rounded-full text-xs text-muted-foreground sm:text-sm"
            >
              Public View
            </Badge>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-full text-xs sm:text-sm"
            >
              <Link href="/profile/create-profile">Edit Profile</Link>
            </Button>
          </div>

          <div className="flex flex-row items-center gap-3 px-3 pt-1 sm:gap-4 sm:px-5 md:gap-6 md:px-6 lg:gap-8 xl:gap-10">
            <div
              className="relative -mt-6 size-20 shrink-0 overflow-hidden rounded-full border-2 border-background shadow-md ring-1 ring-border sm:-mt-8 sm:size-24 md:-mt-10 md:size-28 lg:-mt-12 lg:size-32 xl:-mt-16 xl:size-36"
            >
              <Image
                src={
                  user.avatar_url?.trim()
                    ? user.avatar_url
                    : "/demo/selfie.png"
                }
                alt={`${user.fname} ${user.lname}`}
                fill
                sizes="128px"
                className="object-cover"
                priority
              />
            </div>
            <div className="mb-6 min-w-0 flex-1 lg:mb-10 xl:mb-12">
              <h1 className="break-words text-2xl font-serif font-normal leading-tight tracking-tight text-foreground sm:text-2xl md:text-3xl">
                {user.fname} {user.lname}
              </h1>
              <p className="mt-1 font-serif text-sm text-muted-foreground md:text-base">
                {year[user.year - 1]} year •{" "}
                {user.majors?.map((m) => m.name).join(" | ")}
              </p>
            </div>
          </div>
        </Card>

        {/* Bio + hobbies */}
        <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6">
          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:items-stretch lg:gap-6">
            <Card className={`flex h-full flex-col ${cardSurface}`}>
              <CardHeader className="space-y-1">
                <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                  Bio
                </h2>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  A little about {user.fname}.
                </p>
              </CardHeader>
              <CardContent className="flex-1 px-4 pb-4 sm:px-5 sm:pb-5 md:px-6 md:pb-6">
                <div className="h-full rounded-2xl border border-border bg-muted/50 p-3 sm:p-4 md:p-5">
                  <p className="whitespace-pre-line text-sm italic leading-relaxed text-muted-foreground sm:leading-7">
                    &quot;
                    {user.bio?.trim()
                      ? user.bio
                      : `${user.fname} hasn’t added a bio yet.`}
                    &quot;
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className={`flex h-full flex-col ${cardSurface}`}>
              <CardHeader className="space-y-1">
                <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                  Hobbies & Interests
                </h2>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  Things {user.fname} is into.
                </p>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2 sm:gap-3">
                {user.hobbies?.length ? (
                  user.hobbies.map((hobby, index) => (
                    <span
                      key={`${hobby.hobby_id ?? "hobby"}-${index}`}
                      className="rounded-full border border-border bg-muted px-3 py-1.5 text-xs capitalize text-muted-foreground sm:px-4 sm:py-2 sm:text-sm"
                    >
                      {hobby.name}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    No hobbies added yet.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Photos */}
          <Card className={`flex flex-col ${cardSurface}`}>
            <CardHeader className="space-y-1">
              <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                Lifestyle Photos
              </h2>
              <p className="text-xs text-muted-foreground sm:text-sm">
                More of {user.fname}’s vibe.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
                {lifestyleImages.map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="relative aspect-square overflow-hidden rounded-2xl border border-border"
                  >
                    <Image
                      src={image}
                      alt="Profile gallery"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className={`flex flex-col ${cardSurface}`}>
            <CardHeader className="space-y-1">
              <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                Living Habits
              </h2>
              <p className="text-xs text-muted-foreground sm:text-sm">
                How {user.fname} likes to live and share space.
              </p>
            </CardHeader>
            <CardContent className="px-4 pb-4 sm:px-5 sm:pb-5 md:px-6 md:pb-6">
              {user.preferences?.length ? (
                <div className="grid grid-cols-1 gap-2 sm:gap-3 lg:grid-cols-2 lg:gap-4">
                  {user.preferences.map((pref) => (
                    <div
                      key={pref.preference_id}
                      className="flex items-start gap-3 rounded-xl border border-border bg-muted/50 px-3 py-3 sm:items-center sm:gap-4 sm:px-4 sm:py-3.5"
                    >
                      <div className="mt-0.5 shrink-0 text-muted-foreground sm:mt-0">
                        {getPreferenceIcon(pref.name)}
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                        <span className="text-xs font-medium capitalize text-foreground sm:text-sm">
                          {pref.name}
                        </span>
                        <span className="text-xs capitalize text-muted-foreground sm:text-right sm:text-sm">
                          {getPreferenceDisplayLabel(pref)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-2xl border border-border bg-muted/30 p-3 text-xs text-muted-foreground sm:p-4 sm:text-sm">
                  No living habit preferences added yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Card>
  );
}
