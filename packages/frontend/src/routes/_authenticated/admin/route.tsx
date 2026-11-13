import { createFileRoute, Outlet } from "@tanstack/react-router";

/** Shared layout for the admin area; every screen here is under /admin. */
export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  return <Outlet />;
}
