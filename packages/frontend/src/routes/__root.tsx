import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { Navbar } from "@frontend/components/layout/Navbar.tsx";
import type { AuthState } from "@frontend/lib/useAuth.ts";

interface RouterContext {
  auth: AuthState;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});

/** Wraps every screen. */
function RootLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
