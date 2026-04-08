export default function DiscoveryLoading() {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-2">
      {/* ProfileCard Skeleton */}
      <div className="w-full flex flex-col items-center">
        <div className="w-3/4 max-w-4xl bg-card rounded-3xl border border-border shadow-[0_2px_4px_rgba(0,0,0,0.04),_0_8px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.2),_0_8px_24px_rgba(0,0,0,0.3)] overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
            {/* Left — photo skeleton */}
            <div className="md:col-span-5 flex flex-col border-b md:border-b-0 md:border-r border-border overflow-hidden">
              <div className="relative aspect-[3/4] w-full bg-muted animate-pulse" />
            </div>

            {/* Right — info skeleton */}
            <div className="md:col-span-7 flex flex-col overflow-hidden">
              <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-5">
                {/* Name + meta */}
                <div className="flex flex-col gap-2">
                  <div className="h-8 w-44 rounded-lg bg-muted animate-pulse" />
                  <div className="h-4 w-32 rounded-md bg-muted animate-pulse" />
                </div>

                {/* Bio */}
                <div className="flex flex-col gap-2">
                  <div className="h-4 w-full rounded-md bg-muted animate-pulse" />
                  <div className="h-4 w-5/6 rounded-md bg-muted animate-pulse" />
                  <div className="h-4 w-4/6 rounded-md bg-muted animate-pulse" />
                </div>

                <div className="h-px bg-border" />

                {/* Hobbies */}
                <div className="flex flex-col gap-3">
                  <div className="h-3 w-32 rounded bg-muted animate-pulse" />
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

                {/* Living habits */}
                <div className="flex flex-col gap-3">
                  <div className="h-3 w-28 rounded bg-muted animate-pulse" />
                  <div className="flex flex-col grid grid-cols-2 gap-2">
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

              {/* Action buttons */}
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
  );
}
