import { createRouter } from "@tanstack/react-router";
import type { LinkProps } from "@tanstack/react-router";
import { routeTree } from "@frontend/routeTree.gen.ts";
import { DefaultAuthState } from "@frontend/lib/useAuth.ts";

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
  context: {
    auth: DefaultAuthState,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }

  /** Per-screen settings, set with `staticData` in a route. */
  interface StaticDataRouteOption {
    /** Where the navbar's back arrow goes; leave unset to hide it. */
    backTo?: LinkProps["to"];
    /**
     * Screen background. Defaults to "wallpaper" (the dark teal wallpaper);
     * "none" turns it off so the screen can set its own. Child routes inherit
     * from their layout route unless they set their own.
     */
    background?: "wallpaper" | "none";
  }
}
