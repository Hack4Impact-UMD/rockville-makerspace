import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "filled" | "outlined";

const variantClasses: Record<Variant, string> = {
  filled: "bg-[#F8FEFF] text-[#0B7285] hover:bg-white",
  outlined: "bg-[#F2FFF0] text-dark-green hover:bg-[#E8FFE4]",
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
      className={`flex h-[220px] w-full cursor-pointer items-center justify-center gap-5 rounded-lg text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {icon}
      <span className="flex flex-col gap-1">
        <span className="text-[32px] leading-[38px] font-bold">{title}</span>
        {description ? <span className="text-xl">{description}</span> : null}
      </span>
    </button>
  );
}
