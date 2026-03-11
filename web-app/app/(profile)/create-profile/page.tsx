"use client";

import { createProfileAction } from "@/app/(profile)/_actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function CreateProfilePage() {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await createProfileAction(formData);

      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create Profile
        </h1>
        <p className="text-gray-600 mb-6">Tell us about yourself</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="fname"
                className="text-sm font-medium text-gray-700"
              >
                First Name
              </Label>
              <Input
                id="fname"
                name="fname"
                type="text"
                placeholder="John"
                required
                disabled={isSubmitting}
                className="mt-1"
              />
            </div>
            <div>
              <Label
                htmlFor="lname"
                className="text-sm font-medium text-gray-700"
              >
                Last Name
              </Label>
              <Input
                id="lname"
                name="lname"
                type="text"
                placeholder="Doe"
                required
                disabled={isSubmitting}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="gender"
              className="text-sm font-medium text-gray-700"
            >
              Gender
            </Label>
            <select
              id="gender"
              name="gender"
              required
              disabled={isSubmitting}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Non-binary">Non-binary</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          <div>
            <Label
              htmlFor="major"
              className="text-sm font-medium text-gray-700"
            >
              Major
            </Label>
            <Input
              id="major"
              name="major"
              type="text"
              placeholder="Computer Science"
              required
              disabled={isSubmitting}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="year" className="text-sm font-medium text-gray-700">
              Year
            </Label>
            <select
              id="year"
              name="year"
              required
              disabled={isSubmitting}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Select Year</option>
              <option value="1">Freshman</option>
              <option value="2">Sophomore</option>
              <option value="3">Junior</option>
              <option value="4">Senior</option>
              <option value="5">Graduate</option>
            </select>
          </div>

          <div>
            <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
              Bio
            </Label>
            <Textarea
              id="bio"
              name="bio"
              placeholder="Tell us about yourself..."
              required
              disabled={isSubmitting}
              className="mt-1 resize-none"
              rows={4}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-linear-to-r from-red-400 to-red-700 hover:from-purple-600 hover:to-blue-600 text-white font-medium py-2 rounded-md transition"
          >
            {isSubmitting ? "Creating Profile..." : "Create Profile"}
          </Button>
        </form>
      </div>
    </div>
  );
}
