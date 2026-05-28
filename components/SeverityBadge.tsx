/**
 * SeverityBadge — colored visual indicator for diagnosis / burnout severity.
 */

import { getSeverityStyle, type SeverityLevel } from "@/lib/severity";

interface SeverityBadgeProps {
  severity: SeverityLevel;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: { dot: "h-2 w-2", text: "text-xs", pad: "px-2 py-0.5 gap-1.5" },
  md: { dot: "h-2.5 w-2.5", text: "text-sm", pad: "px-3 py-1 gap-2" },
  lg: { dot: "h-3 w-3", text: "text-base", pad: "px-4 py-1.5 gap-2.5" },
};

export function SeverityBadge({
  severity,
  size = "md",
  showLabel = true,
  className = "",
}: SeverityBadgeProps) {
  const style = getSeverityStyle(severity);
  const sizes = sizeClasses[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium capitalize ${style.bg} ${style.border} ${style.text} ${sizes.pad} ${sizes.text} ${className}`}
      title={`Severity: ${style.label}`}
    >
      <span
        className={`rounded-full shrink-0 ${style.dot} ${sizes.dot} ring-2 ${style.ring}`}
        aria-hidden
      />
      {showLabel && <span>{style.label}</span>}
    </span>
  );
}
