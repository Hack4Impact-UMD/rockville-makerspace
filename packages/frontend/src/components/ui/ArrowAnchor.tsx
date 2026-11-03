import type { AnchorHTMLAttributes, Ref } from "react";

interface ArrowAnchorProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  ref?: Ref<HTMLAnchorElement>;
}

// The <a> elements behind BackArrow and NextArrow. TODO: style the arrows.
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
