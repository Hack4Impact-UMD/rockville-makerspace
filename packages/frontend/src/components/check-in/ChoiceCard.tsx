import type { ButtonHTMLAttributes, ReactNode } from "react";

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
      className={`relative flex min-h-[130px] cursor-pointer flex-col items-start justify-center gap-2 rounded-[14px] border-2 bg-[#F8FEFF] px-8 py-6 text-left shadow-[0_4px_4px_rgba(0,0,0,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 disabled:cursor-not-allowed disabled:opacity-50 ${
        selected ? "border-[#0B7285]" : "border-transparent"
      } ${className}`}
      {...props}
    >
      {showCheckbox && (
        <span
          aria-hidden="true"
          className={`absolute top-6 right-6 flex h-5 w-5 items-center justify-center rounded-[3px] border-3 text-[10px] leading-none text-white ${
            selected ? "border-[#0B7285] bg-[#0B7285]" : "border-black bg-white"
          }`}
        >
          {selected && "✓"}
        </span>
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
        <span className="mt-2 text-[42px] leading-tight font-[600] text-[#0B7285]">
          {title}
        </span>
        {description ? (
          <span className="text-xl text-neutral-500">{description}</span>
        ) : null}
      </span>
    </button>
  );
}
