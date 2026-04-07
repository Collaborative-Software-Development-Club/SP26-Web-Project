import type { Major, UserProfile } from "@/app/(profile)/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MajorsSelectField } from "./majors-select-field";

export function AboutStep({
  profile,
  majorsCatalog,
  isSubmitting,
  update,
  toggleMajor,
}: {
  profile: UserProfile;
  majorsCatalog: Major[];
  isSubmitting: boolean;
  update: <K extends keyof UserProfile>(
    key: K,
    value: UserProfile[K],
  ) => void;
  toggleMajor: (major: Major) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="fname" className="text-sm font-medium">
            First Name
          </Label>
          <Input
            id="fname"
            type="text"
            placeholder="John"
            value={profile.fname}
            onChange={(e) => update("fname", e.target.value)}
            disabled={isSubmitting}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="lname" className="text-sm font-medium">
            Last Name
          </Label>
          <Input
            id="lname"
            type="text"
            placeholder="Doe"
            value={profile.lname}
            onChange={(e) => update("lname", e.target.value)}
            disabled={isSubmitting}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="gender" className="text-sm font-medium">
          Gender
        </Label>
        <Select
          value={profile.gender || undefined}
          onValueChange={(v) => update("gender", v)}
          disabled={isSubmitting}
        >
          <SelectTrigger id="gender" className="mt-1 w-full max-w-none">
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="non-binary">Non-binary</SelectItem>
            <SelectItem value="n/a">Prefer not to say</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <MajorsSelectField
        selectedMajors={profile.majors}
        catalog={majorsCatalog}
        disabled={isSubmitting}
        toggleMajor={toggleMajor}
      />

      <div>
        <Label htmlFor="year" className="text-sm font-medium">
          Year
        </Label>
        <Select
          value={profile.year === 0 ? undefined : String(profile.year)}
          onValueChange={(v) => update("year", parseInt(v, 10))}
          disabled={isSubmitting}
        >
          <SelectTrigger id="year" className="mt-1 w-full max-w-none">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Freshman</SelectItem>
            <SelectItem value="2">Sophomore</SelectItem>
            <SelectItem value="3">Junior</SelectItem>
            <SelectItem value="4">Senior</SelectItem>
            <SelectItem value="5">Graduate</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="bio" className="text-sm font-medium">
          Bio
        </Label>
        <Textarea
          id="bio"
          placeholder="Tell us about yourself..."
          value={profile.bio}
          onChange={(e) => update("bio", e.target.value)}
          disabled={isSubmitting}
          className="mt-1 resize-none"
          rows={4}
        />
      </div>
    </div>
  );
}
