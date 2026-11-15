import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sign-in")({
  component: SignIn,
});

function SignIn() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-8 sm:py-16">
      <section
        aria-labelledby="staff-sign-in-title"
        className="w-full max-w-[520px] rounded-2xl bg-[#E1EBF9] px-6 py-12 text-center text-slate-950 sm:px-13 sm:py-26"
      >
        <div
          aria-hidden="true"
          className="mx-auto grid size-21 place-items-center rounded-xl bg-dark-orange text-lg font-medium text-white"
        >
          RMS
        </div>

        <h1
          id="staff-sign-in-title"
          className="mt-8 text-3xl font-bold sm:text-[42px] sm:leading-tight"
        >
          Staff Sign In
        </h1>

        <p className="mt-8 rounded-xl border-2 border-dashed border-slate-500 bg-slate-900/5 px-4 py-3.5 text-lg">
          Not added yet. Ask an admin.
        </p>

        <div className="mt-11 sm:mx-2.5">
          {/* TODO: Enable this control when staff SSO is connected. */}
          <button
            type="button"
            disabled
            aria-describedby="staff-sign-in-domain"
            className="min-h-[72px] w-full rounded-xl border-2 border-slate-700 px-4 py-3 text-xl font-medium"
          >
            Sign in with SSO
          </button>
          <p
            id="staff-sign-in-domain"
            className="mt-5 text-sm break-all text-slate-600 sm:text-base"
          >
            @rockvillesciencecenter.org
          </p>
        </div>
      </section>
    </main>
  );
}
