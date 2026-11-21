import { useCountdown } from "@frontend/lib/useCountdown.ts";

/** Seconds before the screen returns home by itself. */
export const AUTO_RETURN_SECONDS = 30;

const timeFormat = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

const tempButtonClasses =
  "cursor-pointer rounded-[10px] px-8 py-4 text-3xl font-medium shadow-[0_4px_4px_rgba(0,0,0,0.25),0_4px_14px_rgba(0,0,0,0.25)]";
const tempSecondaryButtonClasses =
  "bg-white text-dark-cyan outline-[1.5px] -outline-offset-[1.5px] outline-dark-cyan hover:bg-cyan-50";
const tempPrimaryButtonClasses =
  "bg-dark-green outline-1 -outline-offset-1 outline-neon-green hover:brightness-110";

export function CheckedOut({
  firstName,
  checkedOutAt,
  onGoBack,
  onDone,
  onEditTime,
}: {
  /** Left out until the check-out flow knows who is checking out. */
  firstName?: string;
  checkedOutAt: Date;
  onGoBack: () => void;
  onDone: () => void;
  onEditTime: () => void;
}) {
  const secondsLeft = useCountdown(AUTO_RETURN_SECONDS, onDone);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-16 px-28 py-10 text-white">
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
          {firstName
            ? `You’re all checked out, ${firstName}!`
            : "You’re all checked out!"}
        </h1>

        <div className="flex items-center gap-4">
          <p className="text-3xl font-medium">
            Checked out at{" "}
            <time dateTime={checkedOutAt.toISOString()}>
              {timeFormat.format(checkedOutAt)}
            </time>
          </p>
          <button
            type="button"
            onClick={onEditTime}
            aria-label="Edit check-out time"
            className="flex cursor-pointer flex-col items-center rounded-lg bg-white/20 px-2.5 py-1.5 text-xl hover:bg-white/30"
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
      </div>

      <div className="flex gap-7">
        <button
          type="button"
          onClick={onGoBack}
          className={`${tempButtonClasses} ${tempSecondaryButtonClasses}`}
        >
          Go back and fix check out
        </button>
        <button
          type="button"
          onClick={onDone}
          className={`${tempButtonClasses} ${tempPrimaryButtonClasses}`}
        >
          Done! Let someone else check out ({secondsLeft})
        </button>
      </div>
    </div>
  );
}
