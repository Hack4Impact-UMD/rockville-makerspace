import { Children, useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/** Two-row card grid that scrolls horizontally when cards overflow. */
export function ChoiceCardGroup({
  children,
  className = "",
}: {
  /** Cards in reading order (left to right, top to bottom). */
  children: ReactNode;
  className?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState({ widthPct: 100, leftPct: 0 });
  const [overflowing, setOverflowing] = useState(false);

  // The grid fills column by column, so reorder the cards to read row by row.
  const items = Children.toArray(children);
  const cols = Math.ceil(items.length / 2);
  const ordered: ReactNode[] = [];
  for (let c = 0; c < cols; c++) {
    ordered.push(items[c]);
    if (items[c + cols]) ordered.push(items[c + cols]);
  }

  const update = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setThumb({
      widthPct: Math.min(100, (clientWidth / scrollWidth) * 100),
      leftPct: (scrollLeft / scrollWidth) * 100,
    });
    setOverflowing(scrollWidth > clientWidth + 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    if (el.firstElementChild) observer.observe(el.firstElementChild);
    return () => observer.disconnect();
  }, [update, items.length]);

  return (
    <div className={`@container ${className}`}>
      <div
        ref={scrollRef}
        onScroll={update}
        className="-m-4 overflow-x-auto p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="grid w-max auto-cols-[calc((74cqw-1.5rem)/2)] grid-flow-col grid-rows-2 gap-6">
          {ordered}
        </div>
      </div>

      {/* Always rendered so the layout doesn't jump - hidden when nothing overflows. */}
      <div
        aria-hidden="true"
        className={`relative mt-6 h-3 rounded-full ${overflowing ? "" : "invisible"}`}
      >
        <div
          className="absolute top-0 h-full rounded-full bg-[#d9d9d9]"
          style={{ width: `${thumb.widthPct}%`, left: `${thumb.leftPct}%` }}
        />
      </div>
    </div>
  );
}
