import type { ReactNode } from "react";

interface PillProps {
  /** Any Tailwind background class, e.g. "bg-dark-cyan" or "bg-orange". */
  colorClass?: string;
  children?: ReactNode;
}

/** A rounded pill / badge shape. TODO: real styling. */
export function Pill({ colorClass = "", children }: PillProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 ${colorClass}`}
    >
      {children}
    </span>
  );
}
