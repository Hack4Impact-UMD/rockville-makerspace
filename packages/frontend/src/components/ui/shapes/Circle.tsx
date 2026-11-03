import type { ReactNode } from "react";

interface CircleProps {
  /** Diameter in pixels. */
  size?: number;
  /** Any Tailwind background class, e.g. "bg-dark-cyan" or "bg-orange". */
  colorClass?: string;
  children?: ReactNode;
}

/** A circle with its children centred. TODO: real styling. */
export function Circle({ size = 48, colorClass = "", children }: CircleProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-full ${colorClass}`}
      style={{ width: size, height: size }}
    >
      {children}
    </div>
  );
}
