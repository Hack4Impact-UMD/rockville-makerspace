import { createFileRoute, useNavigate } from "@tanstack/react-router";
import checkInBg from "@frontend/assets/images/backgrounds/check-in-bg.webp";

// Same layers as the design: pattern at 90% opacity (the white layer), then a
// 30% black overlay on top.
const backgroundImage = `linear-gradient(rgb(0 0 0 / 0.3), rgb(0 0 0 / 0.3)), linear-gradient(rgb(255 255 255 / 0.1), rgb(255 255 255 / 0.1)), url(${checkInBg})`;

// No back arrow in the navbar on this screen (design has data-back="false");
// "Go back and fix check in" covers that instead.
export const Route = createFileRoute("/_check-in/checked-in")({
  component: CheckedIn,
});

function CheckedIn() {
  const navigate = useNavigate();

  return (
    <div
      style={{ backgroundImage }}
      className="flex min-h-dvh flex-col items-center justify-center gap-16 bg-cover bg-center px-28 py-10 text-white"
    >
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-28"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="m7.5 12 3 3 6-6.5" />
        </svg>

        <h1 className="text-6xl leading-tight font-bold">
          You’re all checked in, Priya!
        </h1>

        <div className="flex items-center gap-4">
          <p className="text-3xl font-medium">Checked in at 6:42 PM</p>
          {/* TODO: open the check-in time editor */}
          <button
            type="button"
            className="flex cursor-pointer flex-col items-start text-xl"
          >
            <span aria-hidden="true" className="flex items-end">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-6"
              >
                <circle cx="12" cy="13" r="8" />
                <path d="M12 9v4l2 2M5 3 2 6M22 6l-3-3" />
              </svg>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mb-3 size-3.5"
              >
                <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              </svg>
            </span>
            Edit
          </button>
        </div>

        {/* TODO: replace with standardized status pill from task 10 */}
        <span className="rounded-full bg-dark-green px-4 py-2 text-xl outline-1 -outline-offset-1 outline-neon-green">
          Active Membership
        </span>
      </div>

      <div className="flex gap-7">
        {/* TODO: replace with standardized buttons from task 10 */}
        <button
          type="button"
          onClick={() => void navigate({ to: "/additional-info" })}
          className="cursor-pointer rounded-[10px] bg-white px-8 py-4 text-3xl font-medium text-dark-cyan shadow-[0_4px_4px_rgba(0,0,0,0.25),0_4px_14px_rgba(0,0,0,0.25)] outline-[1.5px] -outline-offset-[1.5px] outline-dark-cyan hover:bg-cyan-50"
        >
          Go back and fix check in
        </button>
        <button
          type="button"
          onClick={() => void navigate({ to: "/" })}
          className="cursor-pointer rounded-[10px] bg-dark-green px-8 py-4 text-3xl font-medium shadow-[0_4px_4px_rgba(0,0,0,0.25),0_4px_14px_rgba(0,0,0,0.25)] outline-1 -outline-offset-1 outline-neon-green hover:brightness-110"
        >
          Done! Let someone else check in (30)
        </button>
      </div>
    </div>
  );
}
