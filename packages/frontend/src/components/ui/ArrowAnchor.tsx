import type { AnchorHTMLAttributes, Ref } from "react";

interface ArrowAnchorProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  ref?: Ref<HTMLAnchorElement>;
}

// The <a> elements behind BackArrow and NextArrow.
export function BackAnchor({ children, ...props }: ArrowAnchorProps) {
  return (
    <a {...props} className="inline-flex items-center text-black">
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-8"
      >
        <path d="M19 12H5" />
        <path d="m12 19-7-7 7-7" />
      </svg>
      <span className="sr-only">{children ?? "Go back"}</span>
    </a>
  );
}

// TODO: style the arrows.
export function NextAnchor({ children, ...props }: ArrowAnchorProps) {
  return (
    <a {...props} className="inline-flex items-center gap-1 text-sm">
      {children ?? "Next"} →
    </a>
  );
}
