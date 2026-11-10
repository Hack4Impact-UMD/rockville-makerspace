import {
  createRootRouteWithContext,
  Outlet,
  useMatches,
} from "@tanstack/react-router";
import { Navbar } from "@frontend/components/layout/Navbar.tsx";
import type { AuthState } from "@frontend/lib/useAuth.ts";
import wallpaper from "@frontend/assets/images/backgrounds/wallpaper-dark-teal.png";

interface RouterContext {
  auth: AuthState;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});

/** Wraps every screen. */
function RootLayout() {
  // The deepest route that sets `background` wins, so a screen can override its layout.
  const background = useMatches({
    select: (matches) =>
      matches.findLast((m) => m.staticData.background)?.staticData.background ??
      "wallpaper",
  });

  return (
    <div
      className={
        background === "wallpaper"
          ? "flex min-h-dvh flex-col bg-[#0B7285] bg-cover bg-center bg-no-repeat"
          : "flex min-h-dvh flex-col"
      }
      style={
        background === "wallpaper"
          ? { backgroundImage: `url(${wallpaper})` }
          : undefined
      }
    >
      <Navbar />
      {/* Fills the space below the navbar; give a screen's root `flex-1` to fill it too. */}
      <div className="flex flex-1 flex-col">
        <Outlet />
      </div>
    </div>
  );
}
