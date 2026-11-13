/**
 * Example usage:
 * <Button variant="solid" color="blue" size="lg" onClick={handleClick}>
 *   Continue
 * </Button>
 *
 * <Button variant="outline" color="red" size="sm">
 *   Cancel
 * </Button>
 */

import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "solid" | "outline" | "dashed";
type Size = "sm" | "md" | "lg";
type Color = "blue" | "green" | "red" | "gray" | "black";
type Shape = "rounded" | "square";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  color?: Color;
  shape?: Shape;
}

const variantClasses: Record<Variant, string> = {
  primary: "border-2 bg-dark-cyan text-white border-dark-cyan",
  secondary: "border-2 bg-white text-dark-cyan border-dark-cyan",
  solid: "",
  outline: "border-2 bg-transparent",
  dashed: "border-2 border-dashed bg-transparent",
};

const colorClasses: Record<
  Color,
  Record<"solid" | "outline" | "dashed", string>
> = {
  blue: {
    solid: "bg-dark-cyan text-white border-dark-cyan",
    outline: "text-dark-cyan border-dark-cyan",
    dashed: "text-dark-cyan border-dark-cyan",
  },
  green: {
    solid: "bg-dark-green text-white border-dark-green",
    outline: "text-dark-green border-dark-green",
    dashed: "text-dark-green border-dark-green",
  },
  red: {
    solid: "bg-warning text-white border-warning",
    outline: "bg-warning-bg/40 text-warning border-warning",
    dashed: "text-warning border-warning",
  },
  gray: {
    solid: "bg-gray-500 text-white border-gray-500",
    outline: "bg-gray-100 text-gray-600 border-gray-400",
    dashed: "bg-gray-100 text-gray-600 border-gray-400",
  },
  black: {
    solid: "bg-black text-white border-black",
    outline: "text-black border-black",
    dashed: "text-black border-black",
  },
};

const sizeClasses: Record<Size, string> = {
  sm: "min-h-9 px-4 py-2 text-sm",
  md: "min-h-11 px-6 py-2 text-base",
  lg: "min-h-14 px-10 py-4 text-xl",
};

const shapeClasses: Record<Shape, string> = {
  rounded: "rounded-full",
  square: "rounded-md",
};

export function Button({
  variant = "primary",
  size = "md",
  color = "blue",
  shape = "rounded",
  type = "button",
  className = "",
  ...props
}: ButtonProps) {
  const styleVariant =
    variant === "primary"
      ? "solid"
      : variant === "secondary"
        ? "outline"
        : variant;

  const styles =
    variant === "primary" || variant === "secondary"
      ? variantClasses[variant]
      : `${variantClasses[variant]} ${colorClasses[color][styleVariant]}`;

  return (
    <button
      // oxlint-disable-next-line react/button-has-type
      type={type}
      className={`inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${styles} ${sizeClasses[size]} ${shapeClasses[shape]} ${className}`}
      {...props}
    />
  );
}
