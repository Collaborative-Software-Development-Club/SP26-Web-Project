import Link from "next/link";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { signupAction } from "../_actions";

type PageProps = {
  searchParams: Promise<{ error?: string; message?: string }>;
};

export default async function SignupPage({ searchParams }: PageProps) {
  const { error, message } = await searchParams;

  return (
    <div className="flex h-full items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Card className="w-full max-w-sm">
        <CardHeader>
        <CardTitle>Sign up</CardTitle>
        <CardDescription>
          Create an account with your OSU email and password.
        </CardDescription>
      </CardHeader>
      <form action={signupAction}>
        <CardContent className="flex flex-col gap-4">
          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {decodeURIComponent(error)}
            </p>
          )}
          {message && (
            <p className="rounded-md bg-green-500/10 px-3 py-2 text-sm text-green-700 dark:text-green-400">
              {decodeURIComponent(message)}
            </p>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              required
              placeholder="lastname.#@osu.edu"
              autoComplete="email"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="At least 6 characters"
              autoComplete="new-password"
            />
          </div>
          <Button type="submit" className="w-full">
            Sign up
          </Button>
        </CardContent>
      </form>
        <CardFooter className="flex flex-col gap-2 text-center text-sm">
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Log in
            </Link>
          </p>
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground text-sm"
          >
            ← Back to home
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
