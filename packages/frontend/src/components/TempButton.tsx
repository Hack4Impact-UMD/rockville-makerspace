import type { ButtonHTMLAttributes } from "react";

// TEMPORARY: placeholder until the standardized Button from task 10 lands.
// Replace every usage with that component and delete this file.
export function TempButton({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline";
}) {
  const styles =
    variant === "primary"
      ? "border-[#138ea8] bg-[#138ea8] text-white hover:bg-[#0f7f97]"
      : "border-[#138ea8] bg-white text-[#138ea8] hover:bg-[#f2fafc]";

  return (
    <button
      type="button"
      className={`h-12 cursor-pointer rounded-[5px] border-[1.5px] px-6 text-xl font-medium ${styles} ${className}`}
      {...props}
    />
  );
}
