import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// hi
type PageProps = {
  searchParams: Promise<{ message?: string }>;
};

export default async function ConfirmPage({ searchParams }: PageProps) {
  const { message } = await searchParams;
  const text =
    (message && decodeURIComponent(message)) ||
    "Check your email and click the confirmation link to finish signing up.";

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Confirm your email</CardTitle>
          <CardDescription>
            We sent a confirmation link to your OSU email address.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="rounded-md bg-green-500/10 px-3 py-2 text-sm text-green-700 dark:text-green-400">
            {text}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 text-center text-sm">
          <Button asChild className="w-full">
            <Link href="/login">Go to login</Link>
          </Button>
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
