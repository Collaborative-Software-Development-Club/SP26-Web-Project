/* DiscoveryClient Skeleton */
export default function DiscoveryLoading() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center mb-10">
      {/* ProfileCard Skeleton */}
      <div className="w-full bg-zinc-50 dark:bg-black p-4 md:p-8 font-sans flex flex-col items-center">
        {/* Main Card Container */}
        <div className="w-3/4 max-w-4xl bg-white dark:bg-zinc-900 rounded-[2rem] shadow-xl border border-zinc-100 dark:border-zinc-800 overflow-hidden relative md:h-[560px]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-0 h-full">
            {/* Images */}
            <div className="md:col-span-5 flex flex-col p-5 gap-3 border-b md:border-b-0 md:border-r border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-black/20 h-full">
              {/* Main image skeleton */}
              <div className="w-full flex-1 min-h-[300px] md:min-h-0 rounded-2xl bg-zinc-200 dark:bg-zinc-800 animate-pulse" />

              {/* Room thumbnails */}
              <div className="grid grid-cols-2 gap-2 h-[96px] shrink-0">
                <div className="rounded-xl bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                <div className="rounded-xl bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
              </div>
            </div>

            {/* Information */}
            <div className="w-full md:col-span-7 flex flex-col h-full overflow-hidden">
              <div className="p-6 flex-1 overflow-y-auto space-y-5">
                {/* Name + Major */}
                <div className="space-y-2 mb-2">
                  <div className="h-8 w-48 rounded-lg bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                  <div className="h-4 w-36 rounded-md bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <div className="h-4 w-full rounded-md bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                  <div className="h-4 w-5/6 rounded-md bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                  <div className="h-4 w-4/6 rounded-md bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                </div>

                <div className="h-px w-full bg-zinc-100 dark:bg-zinc-800" />

                {/* Hobbies */}
                <div>
                  <div className="h-3 w-32 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse mb-3" />
                  <div className="flex flex-wrap gap-2">
                    {[64, 80, 56, 72, 60].map((w, i) => (
                      <div
                        key={i}
                        className="h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse"
                        style={{ width: `${w}px` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Habits */}
                <div>
                  <div className="h-3 w-28 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse mb-3" />
                  <div className="grid grid-cols-2 gap-2">
                    {[0, 1].map((i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800"
                      >
                        <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-700 animate-pulse shrink-0" />
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="h-2 w-12 rounded bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
                          <div className="h-3 w-16 rounded bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-around gap-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md shrink-0">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* UndoButton Skeleton */}
      <div className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
    </div>
  );
}
