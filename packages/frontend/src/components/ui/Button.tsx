import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary";
type Size = "sm" | "md" | "lg";

// TODO: fill these in with real styles (use colors from styles/tokens/colors.css, e.g. bg-dark-cyan hover:bg-light-cyan).
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

/** Reusable button. Defaults to type="button" so it never submits a form by accident. */
export function Button({
  variant = "primary",
  size = "md",
  type = "button",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      // oxlint-disable-next-line react/button-has-type -- defaults to "button" above
      type={type}
      className={`${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    />
  );
}
