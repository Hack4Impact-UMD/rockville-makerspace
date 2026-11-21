
import { Children, useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/** Responsive purpose card group: vertical on phones, horizontal grid on wider screens. */
export function ChoiceCardGroup({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState({ widthPct: 100, leftPct: 0 });
  const [overflowing, setOverflowing] = useState(false);

  const items = Children.toArray(children);

  // Reorder cards for the two-row, column-first tablet/desktop grid.
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
      leftPct: scrollWidth > 0 ? (scrollLeft / scrollWidth) * 100 : 0,
    });

    setOverflowing(scrollWidth > clientWidth + 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    update();

    const observer = new ResizeObserver(update);
    observer.observe(el);

    if (el.firstElementChild) {
      observer.observe(el.firstElementChild);
    }

    return () => observer.disconnect();
  }, [update, items.length]);

  return (
    <div className={`@container w-full ${className}`}>
      {/* Phone layout: original order, one card per row */}
      <div className="flex w-full flex-col items-center gap-4 md:hidden">
        {items.map((item, index) => (
          <div
            key={index}
            className="w-[clamp(180px,51vw,220px)] max-w-full"
          >
            {item}
          </div>
        ))}
      </div>

      {/* Tablet and desktop layout: two rows with horizontal scrolling */}
      <div
        ref={scrollRef}
        onScroll={update}
        className="hidden overflow-x-auto p-4 md:block md:-m-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="grid w-max auto-cols-[minmax(260px,min(34vw,340px))] grid-flow-col grid-rows-2 gap-6">
          {ordered}
        </div>
      </div>

      {/* Horizontal scroll indicator for tablet and desktop */}
      <div
        aria-hidden="true"
        className={`relative mt-6 hidden h-3 rounded-full md:block ${
          overflowing ? "" : "invisible"
        }`}
      >
        <div
          className="absolute top-0 h-full rounded-full bg-[#d9d9d9]"
          style={{
            width: `${thumb.widthPct}%`,
            left: `${thumb.leftPct}%`,
          }}
        />
      </div>
    </div>
  );
}
