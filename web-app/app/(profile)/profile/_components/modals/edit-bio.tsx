"use client";
import { useState } from "react";

export default function EditBio({ bio }: { bio: string }) {
  const [userBio, setBio] = useState(bio);
  return (
    <>
      <textarea
        value={userBio}
        onChange={(e) => setBio(e.target.value)}
        className="w-2/3 border-2 border-gray-400 bg-gray-50 text-sm text-gray-600 min-h-20 rounded-md shadow-sm shadow-gray-400"
      />
    </>
  );
}
