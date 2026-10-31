import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/checked-in")({ component: CheckedIn });

function CheckedIn() {
  return (
    // TODO: temporary full-screen cover over the template layout in __root.tsx.
    // pt-34 leaves room for the 96px navbar. Remove `fixed inset-0` once the
    // navbar layout lands.
    <div className="fixed inset-0 flex scheme-light flex-col justify-between gap-7 overflow-auto bg-white px-30 pt-34 pb-10 text-neutral-800">
      <div className="flex max-w-[600px] flex-col gap-4">
        <div className="flex items-start gap-4">
          <h1 className="text-[40px] leading-tight font-bold">
            You’re all checked in, Priya!
          </h1>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-14 shrink-0 text-green-500"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m8 12 3 3 5-6" />
          </svg>
        </div>

        <p className="text-xl text-neutral-400">Checked in at 6:42 PM</p>

        <div className="flex items-center justify-between border-b border-zinc-300 py-4">
          <h2 className="text-[28px] font-medium text-neutral-500">
            Membership
          </h2>
          {/* TODO: replace with standardized status pill from task 10 */}
          <span className="rounded-full bg-green-500 px-4 py-2 text-xl text-white">
            Active
          </span>
        </div>

        <label className="font-inter mx-4 flex h-11 w-fit cursor-pointer items-center gap-3 px-3.5 text-[15px]">
          <input
            type="checkbox"
            className="size-[18px] cursor-pointer appearance-none rounded-sm bg-stone-300 checked:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
          />
          Seed Library
        </label>
      </div>

      <div className="flex gap-7">
        {/* TODO: replace with standardized buttons from task 10 */}
        <button
          type="button"
          className="cursor-pointer rounded-[10px] px-8 py-4 text-[28px] leading-[38px] font-medium text-cyan-600 outline-[1.5px] outline-offset-[-1.5px] outline-cyan-600 hover:bg-cyan-50"
        >
          Go back
        </button>
        <button
          type="button"
          className="cursor-pointer rounded-[10px] bg-green-500 px-8 py-4 text-[28px] leading-[38px] font-medium text-white hover:bg-green-600"
        >
          Check In someone else(10)
        </button>
      </div>
    </div>
  );
}
