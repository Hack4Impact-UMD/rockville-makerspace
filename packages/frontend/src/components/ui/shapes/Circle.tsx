import type { ReactNode } from "react";

interface CircleProps {
  /** Diameter in pixels. */
  size?: number;
  /** Tailwind background class, e.g. "bg-dark-cyan". */
  colorClass?: string;
  children?: ReactNode;
}

/** Circle with centred children. TODO: real styling. */
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
