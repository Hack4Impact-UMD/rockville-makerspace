import { createLink } from "@tanstack/react-router";
import { BackAnchor } from "@frontend/components/ui/ArrowAnchor.tsx";

/** Link to the previous screen; takes the same typed props as a TanStack Link. */
export const BackArrow = createLink(BackAnchor);
