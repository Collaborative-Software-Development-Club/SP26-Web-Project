import { Card } from "@/components/ui/card";
import EditBio from "./modals/edit-bio";
import SelectHobbies from "./modals/hobby-select";
import MajorSelect from "./modals/major-select";
import type { UserProfile } from "@/app/(profile)/types";

export default function ProfilePage({ profile }: { profile: UserProfile }) {
  const user = profile;
  const images = ["demo/room1.png", "demo/room2.png", "add-img.webp"];
  const year = ["1st", "2nd", "3rd", "4th", "5th"];
  return (
    <>
      <Card className="h-full w-full overflow-auto rounded-none border-none bg-linear-to-b from-pink-50 via-white to-white p-6 shadow-none md:p-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-6">
          {/* Profile hero */}
          <Card className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="h-32 w-full bg-linear-to-r from-pink-200 via-rose-100 to-orange-100" />

            <div className="relative px-6 pb-6">
              <img
                src="demo/selfie.png"
                alt={`${user.fname} ${user.lname}`}
                className="absolute -top-14 h-28 w-28 rounded-full border-4 border-white object-cover shadow-md"
              />

              <div className="pt-20 md:flex md:items-end md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                    {user.fname + " " + user.lname}
                  </h1>
                  <p className="mt-1 text-sm text-gray-500">
                    {year[user.year - 1]} year • {user.majors?.map((m)=>m.name).join(" | ")}
                  </p>
                </div>

                <div className="mt-4 flex gap-2 md:mt-0">
                  <span className="rounded-full bg-pink-100 px-4 py-2 text-sm font-medium text-pink-700">
                    Profile
                  </span>
                  <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
                    Public View
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Main profile content */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            {/* Left/main section */}
            <div className="xl:col-span-2 space-y-6">
              {/* About */}
              <Card className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-5">
                  <h2 className="text-2xl font-semibold text-gray-900">About Me</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    A quick look at who {user.fname} is.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Major
                    </p>
                    <p className="mt-2 text-base font-medium text-gray-800">
                      {user.majors?.map((m)=>m.name).join(" | ")}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      School Year
                    </p>
                    <p className="mt-2 text-base font-medium text-gray-800">
                      {year[user.year - 1]} year
                    </p>
                  </div>
                </div>
              </Card>

              {/* Bio */}
              <Card className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4">
                  <h2 className="text-2xl font-semibold text-gray-900">Bio</h2>
                </div>

                <div className="rounded-2xl bg-gray-50 p-5">
                  <p className="whitespace-pre-line text-sm leading-7 text-gray-700">
                    {user.bio || `${user.fname} hasn’t added a bio yet.`}
                  </p>
                </div>
              </Card>

              {/* Interests */}
              <Card className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4">
                  <h2 className="text-2xl font-semibold text-gray-900">Interests</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Things {user.fname} is into.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {user.hobbies?.length ? (
                    user.hobbies.map((hobby, index) => (
                      <div
                        key={`${hobby.hobby_id ?? "hobby"}-${index}`}
                        className="rounded-full border border-pink-200 bg-pink-50 px-4 py-2 text-sm font-medium text-pink-700"
                      >
                        {hobby.name}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No hobbies added yet.</p>
                  )}
                </div>
              </Card>
            </div>

            {/* Right/sidebar section */}
            <div className="space-y-6">
              {/* Gallery */}
              <Card className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4">
                  <h2 className="text-2xl font-semibold text-gray-900">Photos</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    More of {user.fname}’s vibe.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {images.map((image, index) => (
                    <img
                      src={image}
                      key={`${image}-${index}`}
                      alt="Profile gallery"
                      className="aspect-square w-full rounded-2xl border border-gray-200 object-cover"
                    />
                  ))}
                </div>
              </Card>

              {/* Quick summary card */}
              <Card className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900">Quick Snapshot</h2>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
                    <span className="text-sm text-gray-500">Name</span>
                    <span className="text-sm font-medium text-gray-800">
                      {user.fname + " " + user.lname}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
                    <span className="text-sm text-gray-500">Year</span>
                    <span className="text-sm font-medium text-gray-800">
                      {year[user.year - 1]}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
                    <span className="text-sm text-gray-500">Major</span>
                    <span className="text-right text-sm font-medium text-gray-800">
                      {user.majors?.map((m)=>m.name).join(" | ")}
                    </span>
                  </div>

                  <div className="rounded-2xl bg-pink-50 px-4 py-4 text-sm text-pink-700">
                    This is a public-facing profile preview, not an edit page.
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}
