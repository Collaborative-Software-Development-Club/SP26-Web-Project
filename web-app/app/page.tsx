import { Button } from "@/components/ui/button";
import { ArrowRight, Home as HomeIcon, MessageSquare, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ROUTES = {
  SIGNUP: "/signup",
  LOGIN: "/login",
} as const;

const HERO_IMAGE = "/background.png";

export default function HomePage() {
  return (
    <main className="flex min-h-0 w-full flex-col bg-background font-sans">
      <a
        href="#main-content"
        className="absolute left-[-9999px] z-[100] rounded-md bg-primary px-4 py-2 text-primary-foreground outline-none ring-offset-background focus:left-4 focus:top-4 focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        Skip to content
      </a>

      <section
        id="main-content"
        aria-labelledby="hero-heading"
        className="relative z-10 w-full pt-12 pb-16 md:pb-24 md:pt-24"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-12 px-6 md:grid-cols-2 md:items-center md:px-12">
          <div className="relative z-10 flex min-h-0 flex-col space-y-8">
            <h1
              id="hero-heading"
              className="text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl"
            >
              Find your perfect <br className="hidden md:block" />
              <span className="text-primary">OSU roommate</span>
            </h1>
            <p className="max-w-md text-lg text-muted-foreground md:text-xl">
              Connect with verified Ohio State University students, find
              off-campus housing, and safely match with roommates who share your
              living habits and vibe.
            </p>
            <div className="flex flex-col gap-4 pt-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 text-base shadow-lg"
              >
                <Link href={ROUTES.SIGNUP}>Create a free account</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-8 text-base"
              >
                <Link href={ROUTES.LOGIN}>
                  Log in
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                </Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              * Requires an active @osu.edu email address to sign up.
            </p>
          </div>

          <div className="relative h-96 w-full overflow-hidden rounded-3xl border border-border shadow-2xl md:h-[550px]">
            <Image
              src={HERO_IMAGE}
              alt=""
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
            />
            <p className="absolute bottom-4 right-4 rounded bg-black/40 px-2 py-1 text-xs text-white/80 backdrop-blur-md">
              Placeholder image
            </p>
          </div>
        </div>
      </section>

      <div
        className="relative z-0 mx-auto h-px w-full max-w-7xl bg-border"
        role="separator"
        aria-hidden
      />

      <section
        aria-labelledby="features-heading"
        className="relative z-0 w-full py-20 md:py-32"
      >
        <div className="mx-auto max-w-7xl px-6 text-center md:px-12">
          <h2
            id="features-heading"
            className="mb-16 text-3xl font-semibold tracking-tight text-foreground md:text-4xl"
          >
            Everything you need for off-campus living
          </h2>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
            <article className="group flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                <Users aria-hidden className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-xl font-medium text-foreground">
                Smart Roommate Matching
              </h3>
              <p className="leading-relaxed text-muted-foreground">
                Browse verified student profiles. Filter by graduation year,
                major, and living habits like cleanliness, quiet hours, and pet
                preferences.
              </p>
            </article>

            <article className="group flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 transition-transform duration-300 group-hover:scale-110">
                <MessageSquare aria-hidden className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-xl font-medium text-foreground">
                Secure Live Chat
              </h3>
              <p className="leading-relaxed text-muted-foreground">
                Once you match, connect instantly and securely to coordinate
                housing plans without having to exchange personal numbers
                prematurely.
              </p>
            </article>

            <article className="group flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 transition-transform duration-300 group-hover:scale-110">
                <HomeIcon aria-hidden className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-xl font-medium text-foreground">
                Discover Housing
              </h3>
              <p className="leading-relaxed text-muted-foreground">
                Browse our comprehensive database of off-campus rentals. Sort by
                sector, distance to campus, bedrooms, and price.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="cta-heading"
        className="relative z-0 mb-10 w-full bg-zinc-50 py-24 text-center dark:bg-zinc-900/50"
      >
        <div className="mx-auto flex max-w-3xl flex-col items-center px-6">
          <h2
            id="cta-heading"
            className="mb-6 text-3xl font-bold tracking-tight md:text-4xl"
          >
            Ready to find your living situation?
          </h2>
          <p className="mb-10 text-lg text-muted-foreground">
            Join thousands of Buckeyes streamlining their off-campus living
            experience.
          </p>
          <Button asChild size="lg" className="h-14 rounded-full px-12 text-lg">
            <Link href={ROUTES.SIGNUP}>Get Started Now</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
