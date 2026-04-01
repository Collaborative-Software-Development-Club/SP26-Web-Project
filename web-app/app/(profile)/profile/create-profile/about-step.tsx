import type { UserProfile } from "@/app/(profile)/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type AboutStepProps = {
  profile: UserProfile;
  isSubmitting: boolean;
  update: <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => void;
};

export function AboutStep({ profile, isSubmitting, update }: AboutStepProps) {
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
        <select
          id="gender"
          value={profile.gender}
          onChange={(e) => update("gender", e.target.value)}
          disabled={isSubmitting}
          className="mt-1 w-full px-3 py-2 border border-input bg-background text-foreground rounded-md shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Non-binary">Non-binary</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>
      </div>

      <div>
        <Label htmlFor="major" className="text-sm font-medium">
          Major
        </Label>
        <Input
          id="major"
          type="text"
          placeholder="Computer Science"
          value={profile.major}
          onChange={(e) => update("major", e.target.value)}
          disabled={isSubmitting}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="year" className="text-sm font-medium">
          Year
        </Label>
        <select
          id="year"
          value={profile.year === 0 ? "" : String(profile.year)}
          onChange={(e) => {
            const v = e.target.value;
            update("year", v === "" ? 0 : parseInt(v, 10));
          }}
          disabled={isSubmitting}
          className="mt-1 w-full px-3 py-2 border border-input bg-background text-foreground rounded-md shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring"
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
