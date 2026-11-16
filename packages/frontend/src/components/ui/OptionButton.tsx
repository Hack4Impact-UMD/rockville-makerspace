import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "filled" | "outlined";

const variantClasses: Record<Variant, { tile: string; title: string }> = {
  // Figma "Brand 01 Light" tile with "Brand 01" text.
  filled: {
    tile: "bg-[#f8feff] hover:bg-white",
    title: "text-teal",
  },
  // Figma "Brand 02 Light" tile with a "Brand 02" border and text.
  outlined: {
    tile: "border-2 border-dark-green bg-[#f8fef8] hover:bg-white",
    title: "text-dark-green",
  },
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

/** Large tappable tile for kiosk choices; always a plain button. Size it from the parent. */
export function OptionButton({
  variant = "filled",
  title,
  description,
  icon,
  className = "",
  ...props
}: OptionButtonProps) {
  const styles = variantClasses[variant];

  return (
    <button
      type="button"
      className={`flex w-full cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-[11.5px] px-5 py-4 text-center shadow-[0_4px_5px_5px_rgba(0,0,0,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${styles.tile} ${className}`}
      {...props}
    >
      {icon}
      <span className="flex flex-col items-center gap-1 leading-none">
        <span
          className={`text-[28px] font-bold sm:text-[40px] ${styles.title}`}
        >
          {title}
        </span>
        {description ? (
          <span className="text-lg font-medium text-[#565656] sm:text-[28px]">
            {description}
          </span>
        ) : null}
      </span>
    </button>
  );
}
