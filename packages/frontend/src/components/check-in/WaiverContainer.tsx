import { useState } from "react";
import type { ReactNode } from "react";

interface WaiverContainerProps {
  children?: ReactNode;
}

/** Holds the waiver content and consent controls. */
export function WaiverContainer({ children }: WaiverContainerProps) {
  const [agreed, setAgreed] = useState(false);

  return (
    <section
      aria-label="Safety waiver"
      className="mx-auto flex min-h-[510px] w-full max-w-[1070px] flex-col rounded-[28px] bg-[#D9D9D9] px-6 py-10 text-black sm:px-12 sm:py-14"
    >
      <div className="flex min-h-60 flex-1 items-center justify-center sm:min-h-72">
        {children ?? (
          // TODO: replace this placeholder with the actual waiver content.
          <p className="text-center text-3xl font-bold sm:text-5xl">
            waiver goes here
          </p>
        )}
      </div>

      <div className="mt-8 flex flex-col items-center gap-5">
        <label className="flex cursor-pointer items-start gap-4 text-lg sm:items-center sm:text-2xl">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(event) => setAgreed(event.target.checked)}
            className="mt-1 size-5 shrink-0 cursor-pointer accent-[#0B7285] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B7285] sm:mt-0"
          />
          <span>I agree to all terms of this waiver</span>
        </label>

        {/* TODO (task 10): replace this temporary button with the standardized button. */}
        {/* TODO: connect submission when the actual waiver integration is available. */}
        <button
          type="button"
          disabled={!agreed}
          className="min-h-16 w-full max-w-72 rounded-xl bg-[#0F5F6E] px-6 py-4 text-2xl font-bold text-white shadow-lg transition-colors enabled:cursor-pointer enabled:hover:bg-[#0B4C58] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B7285] disabled:cursor-not-allowed sm:text-3xl"
        >
          Submit waiver
        </button>
      </div>
    </section>
  );
}
