import type { ReactNode } from "react";

// TEMPORARY: placeholder until the standardized status pill from task 10
// lands. Replace every usage with that component and delete this file.
export function TempStatusPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-[30px] items-center rounded-full border border-[#138ea8] px-3 text-sm text-[#138ea8]">
      {children}
    </span>
  );
}
