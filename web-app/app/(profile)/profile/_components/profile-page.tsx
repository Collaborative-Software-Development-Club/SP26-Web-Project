import { Card } from "@/components/ui/card";
import EditBio from "./modals/edit-bio";
import profiles from "mock/profiles.json";
import SelectHobbies from "./modals/hobby-select";
import MajorSelect from "./modals/major-select";
import type { UserProfile } from "@/app/(profile)/types";

export default function ProfilePage({ profile }: { profile: UserProfile }) {
  const user = profile;
  const images = ["demo/room1.png", "demo/room2.png", "add-img.webp"];
  const year = ["1st", "2nd", "3rd", "4th", "5th"];
  return (
    <>
      <Card className="h-full w-full overflow-auto rounded-none border-none bg-zinc-50 p-8 shadow-none">
        {/* Header */}
        <Card className="flex flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-center">
          <img
            src="demo/selfie.png"
            className="h-28 w-28 rounded-full border-2 border-gray-200 object-cover"
          />

          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900">
              {user.fname + " " + user.lname}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {year[user.year - 1]} year
            </p>
          </div>
        </Card>

        {/* Main content */}
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* Left column */}
          <Card className="xl:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                About You
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Update your personal details and profile information.
              </p>
              <hr className="mt-4 h-px border-0 bg-gray-200" />
            </div>

            <div className="space-y-8">
              {/* Major */}
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <h3 className="text-base font-semibold text-gray-800">
                    Major
                  </h3>
                </div>
                <div className="flex items-center">
                  <p className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-700 flex-1 shadow-sm shadow-gray-300">
                    {user.major}
                  </p>
                  <MajorSelect />
                </div>
              </div>

              {/* Hobbies */}
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <h3 className="text-base font-semibold text-gray-800">
                    Hobbies
                  </h3>
                </div>
                <div className="flex items-center">
                  <div className="flex flex-wrap gap-2 rounded-xl bg-gray-50 p-4 flex-1 shadow-sm shadow-gray-300">
                    {user.hobbies?.map((hobby, index) => (
                      <div
                        key={`${hobby.hobby_id ?? "hobby"}-${index}`}
                        className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700"
                      >
                        {hobby.name}
                      </div>
                    ))}
                  </div>
                  <SelectHobbies />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-gray-800">Bio</h3>
              <div className="p-2">
                <EditBio bio={user.bio} />
              </div>
            </div>
          </Card>

          {/* Right column */}
          <Card className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Room Photos
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Show what your space looks like.
              </p>
              <hr className="mt-4 h-px border-0 bg-gray-200" />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-2">
              {images.map((image, index) => (
                <img
                  src={image}
                  key={`${image}-${index}`}
                  className="aspect-square w-full rounded-xl border border-gray-200 object-cover"
                />
              ))}
            </div>
          </Card>
        </div>
      </Card>
    </>
  );
}
