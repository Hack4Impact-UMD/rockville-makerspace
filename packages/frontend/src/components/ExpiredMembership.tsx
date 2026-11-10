import { useEffect, useRef, useState } from "react";
import noEntryIcon from "@frontend/assets/icons/no-entry.svg";

/** Seconds before the screen moves on to the next check-in by itself. */
export const AUTO_RETURN_SECONDS = 10;

// TEMP: the buttons and status pill below are placeholders styled from the
// Figma. Replace them with the standardized Button and status pill from task 10.
const tempButtonClasses =
  "inline-flex cursor-pointer items-center justify-center rounded-[10px] px-6 py-4 text-center text-xl font-medium shadow-raised sm:px-8 sm:py-[18px] sm:text-[28px] sm:whitespace-nowrap";
const tempPrimaryButtonClasses =
  "border border-bright-green bg-dark-green text-white hover:brightness-110";
const tempSecondaryButtonClasses =
  "border-[1.5px] border-teal bg-white text-teal hover:bg-[#f2f8f9]";
const tempStatusPillClasses =
  "inline-flex items-center rounded-full border-[1.5px] border-warning bg-warning-bg px-4 py-2 text-xl text-warning shadow-raised";

/**
 * Shown when a member tries to check in but their membership has expired.
 * Plays a caution beep on arrival and returns to check-in for the next
 * person once the countdown runs out.
 */
export function ExpiredMembership({
  firstName,
  onGoBack,
  onCheckInSomeoneElse,
}: {
  firstName: string;
  onGoBack: () => void;
  onCheckInSomeoneElse: () => void;
}) {
  const [secondsLeft, setSecondsLeft] = useState(AUTO_RETURN_SECONDS);

  // Read through a ref so a new callback identity doesn't restart the timer.
  const onTimeout = useRef(onCheckInSomeoneElse);
  useEffect(() => {
    onTimeout.current = onCheckInSomeoneElse;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((s) => Math.max(s - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (secondsLeft === 0) onTimeout.current();
  }, [secondsLeft]);

  useEffect(() => {
    playCautionBeep();
  }, []);

  return (
    <div className="flex min-h-dvh flex-col gap-10 px-4 py-10 font-ubuntu leading-[normal] sm:px-10">
      <div className="flex flex-1 flex-col items-center justify-center gap-[18px] text-center">
        <img src={noEntryIcon} alt="" width={56} height={56} />
        <h1 className="text-3xl font-bold break-words text-white sm:text-[40px]">
          WAIT, {firstName}!
        </h1>
        {/* TEMP: replace with the standardized status pill from task 10. */}
        <span className={tempStatusPillClasses}>Inactive membership</span>
        <p
          role="alert"
          className="w-[603px] max-w-full rounded-[10px] bg-warning-bg px-5 py-4 text-left text-lg text-warning sm:text-xl"
        >
          Looks like your membership has lapsed. Please see the staff to help
          you renew before checking in.
        </p>
      </div>

      {/* Stacked at equal widths on narrow screens, side by side from lg up. */}
      <div className="flex flex-col gap-4 sm:mx-auto sm:w-fit lg:w-auto lg:flex-row lg:justify-center lg:gap-6">
        {/* TEMP: replace both with the standardized Button from task 10. */}
        <button
          type="button"
          className={`${tempButtonClasses} ${tempSecondaryButtonClasses}`}
          onClick={onGoBack}
        >
          Go back and fix check in
        </button>
        <button
          type="button"
          className={`${tempButtonClasses} ${tempPrimaryButtonClasses}`}
          onClick={onCheckInSomeoneElse}
        >
          Done! Let someone else check in ({secondsLeft})
        </button>
      </div>
    </div>
  );
}

/** A short tone through Web Audio, skipped where audio isn't available. */
function playCautionBeep() {
  if (typeof AudioContext === "undefined") return;
  try {
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.frequency.value = 880;
    gain.gain.value = 0.2;
    oscillator.connect(gain).connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.3);
    oscillator.onended = () => void ctx.close();
  } catch {
    // Browsers may block audio before any user interaction.
  }
}
