import { createLink } from "@tanstack/react-router";
import { NextAnchor } from "@frontend/components/ui/ArrowAnchor.tsx";

/**
 * Links to the next screen: <NextArrow to="/member-purpose" />.
 * For clicking through the flow on localhost; real screens will move forward
 * from their own action (search, submit, …).
 */
export const NextArrow = createLink(NextAnchor);
