import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary";
type Size = "sm" | "md" | "lg";

// Colors from the Figma "Button" component (Primary / Secondary).
const baseClasses =
  "inline-flex cursor-pointer items-center justify-center rounded-[10px] text-center font-ubuntu font-medium shadow-raised";

const variantClasses: Record<Variant, string> = {
  primary:
    "border border-bright-green bg-dark-green text-white hover:brightness-110",
  secondary: "border-[1.5px] border-teal bg-white text-teal hover:bg-[#f2f8f9]",
};

// TODO: sm / md once a design uses them; lg is the kiosk size from Figma.
const sizeClasses: Record<Size, string> = {
  sm: "",
  md: "",
  lg: "px-6 py-4 text-xl sm:px-8 sm:py-[18px] sm:text-[28px] sm:whitespace-nowrap",
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
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    />
  );
}
