import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary";
type Size = "sm" | "md" | "lg";

// TODO: fill in styles, e.g. bg-dark-cyan hover:bg-light-cyan.
const variantClasses: Record<Variant, string> = {
  primary: "",
  secondary: "",
};

const sizeClasses: Record<Size, string> = {
  sm: "",
  md: "",
  lg: "",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

/** Reusable button; `type` defaults to "button". */
export function Button({
  variant = "primary",
  size = "md",
  type = "button",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      // oxlint-disable-next-line react/button-has-type
      // oxlint-disable-next-line react/button-has-type
      type={type}
      className={`${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    />
  );
}
