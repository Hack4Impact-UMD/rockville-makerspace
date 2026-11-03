import { createLink } from "@tanstack/react-router";
import { BackAnchor } from "@frontend/components/ui/ArrowAnchor.tsx";

/**
 * Links to the previous screen: <BackArrow to="/member-search" />.
 * Accepts every typed Link prop (`to`, `search`, `params`, …), so a route
 * that doesn't exist is a type error.
 */
export const BackArrow = createLink(BackAnchor);
