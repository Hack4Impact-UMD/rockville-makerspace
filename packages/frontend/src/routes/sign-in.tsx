import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sign-in")({
  component: SignIn,
});

function SignIn() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-8 sm:py-16">
      <section
        aria-labelledby="staff-sign-in-title"
        className="w-full max-w-[460px] rounded-2xl bg-white px-6 py-12 text-center text-slate-950 shadow-md sm:px-14 sm:py-18"
      >
        <div
          aria-hidden="true"
          className="mx-auto grid size-18.5 place-items-center rounded-xl bg-teal text-base font-medium text-white"
        >
          RMS
        </div>

        <h1
          id="staff-sign-in-title"
          className="mt-7 text-3xl font-bold sm:text-4xl sm:leading-tight"
        >
          Staff Sign In
        </h1>

        <p className="mt-3 text-sm text-slate-600">
          Use your Rockville Science Center account.
        </p>

        <div className="mt-10">
          {/* TODO: Enable this control when staff SSO is connected. */}
          <button
            type="button"
            disabled
            aria-describedby="staff-sign-in-domain"
            className="min-h-16 w-full rounded-xl bg-teal px-4 py-3 text-lg text-white"
          >
            Sign in with SSO
          </button>
          <p
            id="staff-sign-in-domain"
            className="mt-5 text-sm break-all text-slate-600"
          >
            [@rockvillesciencecenter.org]
          </p>
        </div>
      </section>
    </main>
  );
}
