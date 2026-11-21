
import type { ButtonHTMLAttributes, ReactNode } from "react";

import checkboxNo from "@frontend/assets/icons/checkbox-no.svg";
import checkboxYes from "@frontend/assets/icons/checkbox-yes.svg";

interface ChoiceCardProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "title"> {
  title: string;
  description?: string;
  icon?: ReactNode;
  selected?: boolean;
  showCheckbox?: boolean;
}

export function ChoiceCard({
  title,
  description,
  icon,
  selected = false,
  showCheckbox = false,
  className = "",
  ...props
}: ChoiceCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={`relative flex min-h-[89px] cursor-pointer flex-col items-start justify-center gap-[10px] rounded-[14px] border-2 border-transparent bg-[#F8FEFF] px-4 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-[153px] sm:gap-2 sm:px-6 sm:py-6 ${
        selected
          ? "shadow-[0_0_0_8px_var(--color-neon-green),0_4px_4px_6px_rgba(0,0,0,0.25)]"
          : "shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
      } ${className}`}
      {...props}
    >
      {showCheckbox && (
        <img
          src={selected ? checkboxYes : checkboxNo}
          alt=""
          aria-hidden="true"
          className="absolute top-4 right-4 h-6 w-6 sm:top-6 sm:right-6"
        />
      )}

      {icon ? (
        <span className="flex h-6 w-6 shrink-0 items-center justify-center text-black [&>img]:h-full [&>img]:w-full [&>img]:object-contain sm:h-12 sm:w-12">
          {icon}
        </span>
      ) : (
        <span
          aria-hidden="true"
          className="h-6 w-6 rounded-full bg-gray-300 sm:h-12 sm:w-12"
        />
      )}

      <span className="flex flex-col gap-1">
        <span className="text-[18px] leading-tight font-medium text-[#0B7285] sm:text-[32px]">
          {title}
        </span>

        {description && (
          <span className="text-sm text-neutral-500 sm:text-xl">
            {description}
          </span>
        )}
      </span>
    </button>
  );
}
