import type { ButtonHTMLAttributes, ReactNode } from "react";
import checkboxNo from "@frontend/assets/icons/checkbox-no.svg";
import checkboxYes from "@frontend/assets/icons/checkbox-yes.svg";

interface ChoiceCardProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "title"
> {
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
      className={`relative flex min-h-[150px] cursor-pointer flex-col items-start justify-center gap-2 rounded-[14px] border-2 border-transparent bg-[#F8FEFF] px-8 py-6 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 disabled:cursor-not-allowed disabled:opacity-50 ${
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
          className="absolute top-7 right-7 h-5 w-5"
        />
      )}

      {icon ? (
        <span className="flex h-14 w-14 items-center justify-center text-black [&>img]:h-full [&>img]:w-full [&>img]:object-contain">
          {icon}
        </span>
      ) : (
        <span
          aria-hidden="true"
          className="h-14 w-14 rounded-full bg-gray-300"
        />
      )}

      <span className="flex flex-col gap-1 ">
        <span className="mt-2 text-[36px] leading-tight font-medium text-[#0B7285]">
          {title}
        </span>
        {description ? (
          <span className="text-xl text-neutral-500">{description}</span>
        ) : null}
      </span>
    </button>
  );
}
