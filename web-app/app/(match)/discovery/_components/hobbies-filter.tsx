"use client";

import type { Hobby } from "@/app/(profile)/types";
import { Button } from "@/components/ui/button";

export function HobbiesFilter({
  selectedHobbies,
  userHobbies,
  handleHobbyFilterUpdate,
}: {
  selectedHobbies: Set<string>;
  userHobbies: Hobby[];
  handleHobbyFilterUpdate: (hobby: Hobby) => void;
}) {
  return (
    <div className="flex flex-col">
      <h2 className="text-gray-800 font-medium">Hobbies:</h2>
      <div className="flex flex-wrap gap-2 p-2">
        {userHobbies.map((hobby) =>
          selectedHobbies.has(hobby.hobby_id) ? (
            <Button
              key={hobby.hobby_id}
              variant="default"
              onClick={() => handleHobbyFilterUpdate(hobby)}
            >
              {hobby.name}
            </Button>
          ) : (
            <Button
              key={hobby.hobby_id}
              variant="outline"
              onClick={() => handleHobbyFilterUpdate(hobby)}
            >
              {hobby.name}
            </Button>
          ),
        )}
      </div>
    </div>
  );
}
