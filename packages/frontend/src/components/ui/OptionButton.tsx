import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "filled" | "outlined";

const variantClasses: Record<Variant, string> = {
  filled: "bg-[#f0f0f0] hover:bg-[#e6e6e6]",
  outlined:
    "bg-white outline-1 outline-offset-[-1px] outline-neutral-800 hover:bg-zinc-50",
};

interface OptionButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type"
> {
  variant?: Variant;
  title: string;
  /** Smaller line under the title. */
  description?: string;
  /** Shown to the left of the text. */
  icon?: ReactNode;
}

/** Large tappable tile for kiosk choices; always a plain button. */
export function OptionButton({
  variant = "filled",
  title,
  description,
  icon,
  className = "",
  ...props
}: OptionButtonProps) {
  return (
    <button
      type="button"
      className={`flex h-[220px] w-full cursor-pointer items-center justify-center gap-5 rounded-[10px] text-center text-neutral-800 shadow-[0_4px_4px_rgba(0,0,0,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {icon}
      <span className="flex flex-col gap-1">
        <span className="text-[28px] leading-[38px] font-medium">{title}</span>
        {description ? (
          <span className="text-xl text-neutral-500">{description}</span>
        ) : null}
      </span>
    </button>
  );
}
