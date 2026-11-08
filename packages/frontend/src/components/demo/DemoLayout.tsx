import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import type { LinkProps } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { auth } from "@frontend/lib/firebase.ts";
import { useAuth } from "@frontend/lib/useAuth.ts";

/** Old template header, used only by /demo and /notes. Delete with the demo pages. */
export function DemoLayout({ children }: { children: ReactNode }) {
  const { isAuthed } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const signOut = useMutation({
    mutationFn: () => auth.signOut(),
    onSuccess: async () => {
      await queryClient.resetQueries();
      await router.invalidate();
    },
  });

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <header className="mb-8 flex flex-wrap items-center gap-4">
        <h1 className="mr-auto text-lg font-semibold">Template demo</h1>
        <nav className="flex gap-4 text-sm">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/demo">Demo</NavLink>
          {isAuthed && <NavLink to="/notes">Notes</NavLink>}
        </nav>
        {isAuthed ? (
          <button
            type="button"
            data-testid="sign-out"
            onClick={() => signOut.mutate()}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100"
          >
            Sign out
          </button>
        ) : null}
      </header>

      {children}
    </div>
  );
}

function NavLink({ to, children }: { to: LinkProps["to"]; children: string }) {
  return (
    <Link
      to={to}
      className="text-slate-500 transition-colors hover:text-slate-900 data-[status=active]:font-medium data-[status=active]:text-slate-900"
    >
      {children}
    </Link>
  );
}
