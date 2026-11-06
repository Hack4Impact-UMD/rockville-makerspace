import type { ReactNode } from "react";

export function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-slate-200 py-5">
      <h2 className="mb-2 text-xs font-medium tracking-widest text-slate-500 uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}
