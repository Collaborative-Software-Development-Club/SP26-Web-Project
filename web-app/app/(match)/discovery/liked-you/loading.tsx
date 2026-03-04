/* LikedYouClient Skeleton */
export default function LikedYouLoading() {
  return (
    <div className="flex flex-col items-center h-full w-full px-4">
      {/* Header */}
      <div className="w-full max-w-lg mb-8 text-center space-y-2">
        <div className="h-8 w-36 rounded-lg bg-zinc-200 dark:bg-zinc-800 animate-pulse mx-auto" />
        <div className="h-4 w-48 rounded-md bg-zinc-200 dark:bg-zinc-800 animate-pulse mx-auto" />
      </div>

      {/* Main Card */}
      <div className="w-full max-w-lg rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-black/5">
        {/* Avatar & Header */}
        <div className="relative h-52 bg-zinc-200 dark:bg-zinc-800 animate-pulse">
          <div className="absolute bottom-4 left-5 right-5 space-y-2">
            <div className="h-6 w-40 rounded-lg bg-white/30 dark:bg-white/10 animate-pulse" />
            <div className="h-4 w-52 rounded-md bg-white/30 dark:bg-white/10 animate-pulse" />
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Bio */}
          <div className="space-y-2">
            <div className="h-3.5 w-full rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
            <div className="h-3.5 w-5/6 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
          </div>

          {/* Hobbies */}
          <div className="flex flex-wrap gap-2">
            {[56, 72, 48, 64].map((w, i) => (
              <div
                key={i}
                className="h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 animate-pulse"
                style={{ width: `${w}px` }}
              />
            ))}
          </div>

          {/* Preferences */}
          <div className="grid grid-cols-2 gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 px-3 py-2"
              >
                <div className="h-3 w-12 rounded bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
                <div className="h-3 w-10 rounded bg-zinc-200 dark:bg-zinc-700 animate-pulse ml-auto" />
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-zinc-100 dark:border-zinc-800" />

          {/* Incoming Message */}
          <div className="space-y-2">
            <div className="h-3 w-36 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
            <div className="rounded-2xl rounded-tl-sm bg-zinc-100 dark:bg-zinc-800 px-4 py-3 space-y-1.5">
              <div className="h-3 w-full rounded bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
              <div className="h-3 w-4/5 rounded bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
            </div>
          </div>

          {/* Reply Box */}
          <div className="space-y-2">
            <div className="h-3 w-32 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
            <div className="h-[84px] w-full rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 animate-pulse" />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-row justify-around gap-3 pt-1">
            <div className="h-[46px] w-36 rounded-2xl bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
            <div className="h-[46px] w-36 rounded-2xl bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Progress Dots */}
      <div className="mt-6 flex gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`block rounded-full bg-zinc-200 dark:bg-zinc-700 animate-pulse h-2 ${i === 0 ? "w-4" : "w-2"}`}
          />
        ))}
      </div>
    </div>
  );
}
