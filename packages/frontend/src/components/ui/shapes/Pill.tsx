import type { ReactNode } from "react";

interface PillProps {
  /** Tailwind background class, e.g. "bg-dark-cyan". */
  colorClass?: string;
  children?: ReactNode;
}

/** Rounded pill / badge shape. TODO: real styling. */
export function Pill({ colorClass = "", children }: PillProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 ${colorClass}`}
    >
      {children}
    </span>
  );
}
