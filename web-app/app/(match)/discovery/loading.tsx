export default function DiscoveryLoading() {
  return (
    <div className="flex flex-col items-center w-full px-4">
      {/* Title */}
      <div className="hidden md:block w-full max-w-4xl mb-4 relative">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground xl:text-3xl md:text-2xl">
            Discovery
          </h1>
          <p className="text-muted-foreground xl:text-sm md:text-xs">
            Find potential roommates based on your preferences
          </p>
        </div>
      </div>
      <div className="w-full flex flex-col items-center justify-center gap-2">
        {/* ProfileCard Skeleton */}
        <div className="w-full flex flex-col items-center">
          <div className="w-full h-[80dvh] md:w-3/4 md:h-auto md:max-w-4xl bg-card rounded-3xl border border-border shadow-[0_2px_4px_rgba(0,0,0,0.04),_0_8px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.2),_0_8px_24px_rgba(0,0,0,0.3)] overflow-hidden">
            <div className="flex flex-col md:grid md:grid-cols-12 h-full">
              {/* Left — photo skeleton */}
              <div className="shrink-0 md:col-span-5 md:flex md:flex-col md:border-r border-border overflow-hidden h-[30vh] md:h-auto">
                <div className="relative w-full bg-muted overflow-hidden h-full md:aspect-[3/4]">
                  <div className="absolute inset-0 bg-muted animate-pulse" />

                  {/* Dot indicators */}
                  <div className="absolute bottom-0 left-0 right-0 flex gap-1 px-4 pb-3 pt-8 bg-gradient-to-t from-black/30 to-transparent">
                    <div className="h-0.5 flex-1 rounded-full bg-white/40 animate-pulse" />
                    <div className="h-0.5 flex-1 rounded-full bg-white/40 animate-pulse" />
                    <div className="h-0.5 flex-1 rounded-full bg-white/40 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Info column */}
              <div className="flex flex-col flex-1 md:col-span-7 overflow-hidden">
                <div className="p-4 md:p-6 flex-1 overflow-y-auto">
                  {/* Name + meta */}
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="h-8 w-44 rounded-lg bg-muted animate-pulse" />
                      <div className="h-4 w-32 mt-2 rounded-md bg-muted animate-pulse" />
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="mt-3">
                    <div className="h-4 w-full rounded-md bg-muted animate-pulse" />
                    <div className="h-4 w-5/6 mt-2 rounded-md bg-muted animate-pulse" />
                    <div className="h-4 w-4/6 mt-2 rounded-md bg-muted animate-pulse" />
                  </div>

                  <div className="h-px w-full bg-border my-4 md:my-5" />

                  <div className="grid grid-cols-2 gap-y-4 md:gap-y-5 gap-x-4">
                    {/* Hobbies */}
                    <div className="col-span-2">
                      <div className="h-3 w-32 rounded bg-muted animate-pulse mb-3" />
                      <div className="flex flex-wrap gap-2">
                        {[64, 80, 56, 72, 60].map((w, i) => (
                          <div
                            key={i}
                            className="h-7 rounded-full bg-muted animate-pulse"
                            style={{ width: `${w}px` }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Preferences / Living Habits */}
                    <div className="col-span-2">
                      <div className="h-3 w-28 rounded bg-muted animate-pulse mb-3" />
                      <div className="grid grid-cols-2 gap-2">
                        {[0, 1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full bg-muted animate-pulse shrink-0" />
                            <div className="h-3 w-20 rounded bg-muted animate-pulse" />
                            <div className="w-1.5 h-1.5 rounded-full bg-muted animate-pulse" />
                            <div className="h-3 w-12 rounded bg-muted animate-pulse" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-7 py-4 border-t border-border flex justify-around items-center shrink-0">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-11 h-11 rounded-full bg-muted animate-pulse"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
