/**
 * LoadingState — animated spinner shown while repository analysis runs.
 */

export function LoadingState() {
  return (
    <div className="flex flex-col items-center gap-6 py-16 animate-fade-in">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-purple-500/20" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-fuchsia-400 animate-spin" />
        <span className="absolute inset-0 flex items-center justify-center text-2xl">
          🛋️
        </span>
      </div>
      <div className="text-center space-y-2">
        <p className="text-lg font-medium text-theme-primary animate-pulse-soft">
          Analyzing your repository...
        </p>
        <p className="text-sm text-theme-secondary max-w-sm">
          Cloning Git history, reading commit messages, and preparing your therapy
          session. This usually takes 30–60 seconds.
        </p>
      </div>
      <div className="flex gap-2 mt-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-2 w-8 rounded-full bg-purple-500/30 animate-pulse"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
