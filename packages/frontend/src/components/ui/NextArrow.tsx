import { createLink } from "@tanstack/react-router";
import { NextAnchor } from "@frontend/components/ui/ArrowAnchor.tsx";

/** Link to the next screen, for clicking through on localhost. */
export const NextArrow = createLink(NextAnchor);
