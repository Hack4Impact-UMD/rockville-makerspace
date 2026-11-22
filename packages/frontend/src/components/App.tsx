import { RouterProvider } from "@tanstack/react-router";
import { router } from "@frontend/router.tsx";
import { useAuth } from "@frontend/lib/useAuth.ts";

/**
 * Reads the auth state from context and hands it to the router, so loaders and
 * `beforeLoad` guards see the signed-in user. Must render inside `AuthProvider`.
 */
export function App() {
  const auth = useAuth();
  // wait for firebase to restore the signed-in user before routing, so guards
  // don't redirect a signed-in user who reloaded or typed a url
  if (auth.isPending) return null;
  return <RouterProvider router={router} context={{ auth }} />;
}
