/**
 * Example usage:
 * <StatusPill variant="solid" color="green" size="md">
 *   Active
 * </StatusPill>
 *
 * <StatusPill variant="dashed" color="blue" size="lg">
 *   Pending
 * </StatusPill>
 */

import type { HTMLAttributes } from "react";

type Variant = "solid" | "outline" | "dashed";
type Size = "sm" | "md" | "lg";
type Color = "blue" | "green" | "red" | "gray" | "black";

interface StatusPillProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
  size?: Size;
  color?: Color;
}

const variantClasses: Record<Variant, Record<Color, string>> = {
  solid: {
    blue: "bg-dark-cyan text-white border-dark-cyan",
    green: "bg-dark-green text-white border-dark-green",
    red: "bg-warning text-white border-warning",
    gray: "bg-gray-500 text-white border-gray-500",
    black: "bg-black text-white border-black",
  },
  outline: {
    blue: "bg-white text-dark-cyan border-dark-cyan",
    green: "bg-white text-dark-green border-dark-green",
    red: "bg-warning-bg/40 text-warning border-warning",
    gray: "bg-gray-100 text-gray-600 border-gray-400",
    black: "bg-white text-black border-black",
  },
  dashed: {
    blue: "bg-white text-dark-cyan border-dark-cyan border-dashed",
    green: "bg-white text-dark-green border-dark-green border-dashed",
    red: "bg-white text-warning border-warning border-dashed",
    gray: "bg-gray-100 text-gray-600 border-gray-400 border-dashed",
    black: "bg-white text-black border-black border-dashed",
  },
};

const sizeClasses: Record<Size, string> = {
  sm: "min-h-7 px-3 py-1 text-xs",
  md: "min-h-9 px-4 py-2 text-sm",
  lg: "min-h-12 px-6 py-3 text-base",
};

export function StatusPill({
  variant = "solid",
  size = "md",
  color = "green",
  className = "",
  children,
  ...props
}: StatusPillProps) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border-2 font-medium ${variantClasses[variant][color]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
