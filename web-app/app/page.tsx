"use client";

import { useState, useEffect, useCallback } from "react"; // Added useEffect and useCallback
import { Button } from "@/components/ui/button";
import { ArrowRight, Home as HomeIcon, MessageSquare, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { motion } from "framer-motion";

const HERO_IMAGES = [
  "/demo/roommates2.png",
  "/demo/room_layout1.png",
  "/demo/roommates.png",
  "/demo/room_layout2.png"
];

const ROUTES = {
  SIGNUP: "/signup",
  LOGIN: "/login",
} as const;

export default function HomePage() {
  const [photoIndex, setPhotoIndex] = useState(0);

  // Memoize nextPhoto so it can be safely used in the useEffect dependency array
  const nextPhoto = useCallback(() => {
    setPhotoIndex((i) => (i + 1) % HERO_IMAGES.length);
  }, []);

  const prevPhoto = () => setPhotoIndex((i) => (i - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);
  const showPhotoDots = HERO_IMAGES.length > 1;

  // AUTO-SCROLL LOGIC
  useEffect(() => {
    // Set interval for 3 seconds (3000ms) - you can adjust this time
    const timer = setInterval(() => {
      nextPhoto();
    }, 10000);

    // Clean up the timer if the component unmounts or if nextPhoto changes
    return () => clearInterval(timer);
  }, [nextPhoto, photoIndex]); // Re-run effect if nextPhoto or photoIndex changes

  return (
    <main className="flex min-h-0 w-full flex-col bg-background font-sans">
      <a
        href="#main-content"
        className="absolute left-[-9999px] z-[100] rounded-md bg-primary px-4 py-2 text-primary-foreground outline-none focus:left-4 focus:top-4 focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        Skip to content
      </a>

      <section
        id="main-content"
        className="relative z-10 w-full pt-12 pb-16 md:pt-24"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center px-6 text-center md:px-12">
          
          <div className="relative z-10 flex flex-col items-center space-y-8 mb-12 md:mb-16">
            <h1 id="hero-heading" className="text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl">
              Find your perfect <span className="text-primary">OSU roommate</span>
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
              Connect with verified Ohio State University students, find
              off-campus housing, and safely match with roommates who share your
              living habits and vibe.
            </p>
            <div className="flex flex-col gap-4 pt-4 sm:flex-row">
              <Button asChild size="lg" className="rounded-full px-12 text-base shadow-lg">
                <Link href={ROUTES.SIGNUP}>Create a free account</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-12 text-base">
                <Link href={ROUTES.LOGIN}>
                  Log in <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              * Requires an active @osu.edu email address to sign up.
            </p>
          </div>

          <div className="relative w-full max-w-4xl aspect-video md:aspect-[16/9] bg-muted rounded-3xl border border-border shadow-2xl overflow-hidden">
            <div className="relative w-full h-full">
              <Image
                src={HERO_IMAGES[photoIndex]}
                alt="Room preview"
                fill
                priority
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-cover transition-opacity duration-300"
              />

              <div className="absolute inset-0 flex z-10">
                <button className="group relative flex-1" onClick={prevPhoto} aria-label="Previous photo">
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gradient-to-r from-black/20 to-transparent"/>
                </button>
                <button className="group relative flex-1" onClick={nextPhoto} aria-label="Next photo">
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gradient-to-l from-black/20 to-transparent"/>
                </button>
              </div>

              {/* Dot indicators */}
              {showPhotoDots && (
                <div className="absolute bottom-2 left-0 right-0 z-20">
                  <div className="flex w-full gap-[5px]">
                    {HERO_IMAGES.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setPhotoIndex(i)}
                        className="relative h-1 flex-1 rounded-full bg-white/40 overflow-hidden"
                        aria-label={`Go to photo ${i + 1}`}
                      >
                        {/* The Filling Animation */}
                        {i === photoIndex && (
                          <motion.span
                            className="absolute inset-y-0 left-0 bg-white"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            // Key: The duration here must match your 10000ms (10s) interval
                            transition={{ duration: 10, ease: "linear" }}
                            key={photoIndex} // Resets animation when index changes
                          />
                        )}
                        {/* Keep bars white if they were already passed */}
                        {i < photoIndex && <span className="absolute inset-0 bg-white/80" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
