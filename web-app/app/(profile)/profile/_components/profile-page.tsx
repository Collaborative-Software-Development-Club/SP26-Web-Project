import { Card, CardHeader, CardContent } from "@/components/ui/card";
import type { UserProfile } from "@/app/(profile)/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function ProfilePage({ profile }: { profile: UserProfile }) {
  const user = profile;
  const photoImages = ["demo/room1.png", "demo/room2.png"];
  const year = ["1st", "2nd", "3rd", "4th", "5th"];
  return (
    <>
      <Card className="h-full w-full overflow-auto rounded-none border-none bg-linear-to-b from-pink-50 via-white to-white p-3 shadow-none sm:p-5 md:p-6 lg:p-8 pb-0">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:gap-5 lg:gap-6">
          {/* Profile hero — full design at lg+; scales down on smaller screens */}
          <Card className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm sm:rounded-3xl">
            <div className="flex flex-wrap items-center justify-end gap-2 px-3 sm:gap-3 sm:px-5 sm:pt-4 md:px-6 lg:gap-4">
              <Badge className="bg-pink-100 text-xs text-pink-700 sm:text-sm">
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

            <div className="flex flex-row items-center gap-3 px-3 pt-1 sm:gap-4 sm:px-5 md:gap-6 md:px-6 lg:gap-8">
              <div
                className="relative -mt-6 size-20 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-md sm:-mt-8 sm:size-24 sm:border-[3px] md:-mt-10 md:size-28 md:border-[3px] lg:-mt-12 lg:size-32 lg:border-4 xl:-mt-16 xl:size-36"
              >
                <Image
                  src={user.avatar_url ?? "demo/selfie.png"}
                  alt={`${user.fname} ${user.lname}`}
                  fill
                  sizes="128px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="min-w-0 flex-1 mb-6 lg:mb-10 xl:mb-12">
                <h1 className="break-words text-lg font-bold leading-tight tracking-tight text-gray-900 sm:text-xl md:text-2xl lg:text-3xl">
                  {user.fname + " " + user.lname}
                </h1>
                <p className="mt-0.5 text-xs text-gray-500 sm:mt-1 sm:text-sm md:text-base">
                  {year[user.year - 1]} year •{" "}
                  {user.majors?.map((m) => m.name).join(" | ")}
                </p>
              </div>
            </div>
          </Card>

          {/* Bio + hobbies: stacked on mobile, two columns md+ */}
          <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6">
            <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:items-stretch lg:gap-6">
              <Card className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white shadow-sm sm:rounded-3xl">
                <CardHeader>
                  <h2 className="text-lg font-semibold text-gray-900 sm:text-xl md:text-2xl">
                    Bio
                  </h2>
                  <p className="text-xs text-gray-500 sm:text-sm">
                    A little about {user.fname}.
                  </p>
                </CardHeader>
                <CardContent className="flex-1 px-4 pb-4 sm:px-5 sm:pb-5 md:px-6 md:pb-6">
                  <div className="h-full rounded-xl bg-gray-50 p-3 sm:rounded-2xl sm:p-4 md:p-5">
                    <p className="whitespace-pre-line text-xs leading-relaxed text-gray-700 sm:text-sm sm:leading-7">
                      {user.bio || `${user.fname} hasn’t added a bio yet.`}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white shadow-sm sm:rounded-3xl">
                <CardHeader>
                  <h2 className="text-lg font-semibold text-gray-900 sm:text-xl md:text-2xl">
                    Hobbies & Interests
                  </h2>
                  <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                    Things {user.fname} is into.
                  </p>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2 sm:gap-3">
                  {user.hobbies?.length ? (
                    user.hobbies.map((hobby, index) => (
                      <div
                        key={`${hobby.hobby_id ?? "hobby"}-${index}`}
                        className="capitalize rounded-full border border-pink-200 bg-pink-50 px-3 py-1.5 text-xs font-medium text-pink-700 sm:px-4 sm:py-2 sm:text-sm"
                      >
                        {hobby.name}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 sm:text-sm">
                      No hobbies added yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Photos — fewer columns on narrow screens */}
            <Card className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white shadow-sm sm:rounded-3xl">
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900 sm:text-xl md:text-2xl">
                  Lifestyle Photos
                </h2>
                <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                  More of {user.fname}’s vibe.  
                </p>
              </CardHeader>
              <CardContent>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
                {photoImages.map((image, index) => (
                  <img
                    src={image}
                    key={`${image}-${index}`}
                    alt="Profile gallery"
                    className="aspect-square w-full rounded-xl border border-gray-200 object-cover sm:rounded-2xl"
                  />
                ))}
              </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Card>
    </>
  );
}
