import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { AuthState } from "@frontend/lib/useAuth.ts";

interface RouterContext {
  auth: AuthState;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});

/** App-wide wrapper around every screen. Intentionally blank for now. */
function RootLayout() {
  return <Outlet />;
}
