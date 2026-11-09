import type { ReactNode } from "react";

interface PillProps {
  /** Tailwind background class, e.g. "bg-dark-cyan". */
  colorClass?: string;
  children?: ReactNode;
}

/** Rounded pill / badge shape, sized like the Figma "Status Pill". */
export function Pill({ colorClass = "", children }: PillProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-4 py-2 font-ubuntu text-xl ${colorClass}`}
    >
      {children}
    </span>
  );
}
