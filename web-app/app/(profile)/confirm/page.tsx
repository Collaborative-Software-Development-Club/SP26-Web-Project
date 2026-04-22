import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OtpForm } from "./otp-form";

type PageProps = {
  searchParams: Promise<{ error?: string; message?: string; email: string }>;
};

export default async function ConfirmPage({ searchParams }: PageProps) {
  const { error, message, email } = await searchParams;

  return (
    <div className="flex h-full items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Confirm your email</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to your email.
          </CardDescription>
        </CardHeader>
        <OtpForm error={error} message={message} email={email} />
        <CardFooter className="flex flex-col gap-2 text-center text-sm">
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
