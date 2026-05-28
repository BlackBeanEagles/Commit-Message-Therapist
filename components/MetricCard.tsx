/**
 * MetricCard — displays a single Git metric stat on the results dashboard.
 */

interface MetricCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  highlight?: boolean;
}

export function MetricCard({ label, value, sublabel, highlight }: MetricCardProps) {
  return (
    <div
      className={`glass rounded-xl p-4 transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/10 ${
        highlight ? "ring-1 ring-fuchsia-400/40" : ""
      }`}
    >
      <p className="text-xs uppercase tracking-wider text-theme-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold text-theme-primary">{value}</p>
      {sublabel && <p className="mt-1 text-sm text-theme-secondary">{sublabel}</p>}
    </div>
  );
}
