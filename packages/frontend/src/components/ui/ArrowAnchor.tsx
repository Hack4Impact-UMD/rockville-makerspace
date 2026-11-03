import type { AnchorHTMLAttributes, Ref } from "react";

interface ArrowAnchorProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  ref?: Ref<HTMLAnchorElement>;
}

/**
 * The plain <a> elements behind BackArrow and NextArrow. Those files wrap
 * these with TanStack's `createLink`, which adds the typed router props.
 * TODO: style the arrows (swap the glyphs for an icon/SVG if you like).
 */
export function BackAnchor({ children, ...props }: ArrowAnchorProps) {
  return (
    <a {...props} className="inline-flex items-center gap-1 text-sm">
      ← {children ?? "Back"}
    </a>
  );
}

export function NextAnchor({ children, ...props }: ArrowAnchorProps) {
  return (
    <a {...props} className="inline-flex items-center gap-1 text-sm">
      {children ?? "Next"} →
    </a>
  );
}
