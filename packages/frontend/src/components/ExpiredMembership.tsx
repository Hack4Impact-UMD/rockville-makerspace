import { useEffect, useRef, useState } from "react";
import { Button } from "@frontend/components/ui/Button.tsx";
import { Pill } from "@frontend/components/ui/shapes/Pill.tsx";

// The shared Button and Pill have no styles yet, so this screen supplies its own.
const buttonBase =
  "h-12 cursor-pointer rounded-[5px] border-[1.5px] px-6 text-xl font-medium";

/** Seconds before the screen moves on to the next check-in by itself. */
export const AUTO_RETURN_SECONDS = 10;

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
    <div className="max-w-[426px]">
      <div
        role="alert"
        className="inline-flex h-[31px] items-center gap-2 rounded-[5px] bg-amber-100 px-3 text-sm text-amber-900"
      >
        <CautionIcon />
        <span>Caution: membership inactive</span>
      </div>

      <div className="mt-[22px] flex items-center gap-[17px]">
        <h2 className="text-[28px] font-bold text-[#222]">
          WAIT, {firstName}!
        </h2>
        <NoEntryIcon />
      </div>

      <p className="mt-4 text-sm text-[#666]">Not checked in quite yet!</p>

      <p className="mt-[13px] rounded-md bg-[#f0f0f0] px-[14px] py-3 text-[13.5px] leading-[16.5px] text-[#222]">
        Looks like your membership has lapsed. Please see the staff to help you
        renew before checking in.
      </p>

      <div className="mt-[26px] flex items-center justify-between border-b border-[#ddd] pb-[13px]">
        <span className="text-xl font-medium text-[#666]">Membership</span>
        <Pill colorClass="h-[30px] border border-light-cyan text-sm text-light-cyan">
          Inactive
        </Pill>
      </div>

      <div className="mt-24 flex flex-wrap gap-5">
        <Button
          variant="secondary"
          className={`${buttonBase} border-light-cyan bg-white text-light-cyan hover:bg-[#f2fafc]`}
          onClick={onGoBack}
        >
          Go back
        </Button>
        <Button
          variant="primary"
          className={`${buttonBase} border-light-cyan bg-light-cyan text-white hover:bg-dark-cyan`}
          onClick={onCheckInSomeoneElse}
        >
          Check In someone else({secondsLeft})
        </Button>
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

function CautionIcon() {
  return (
    <svg width="16" height="14" viewBox="0 0 16 14" aria-hidden="true">
      <path
        d="M8 1 L15 13 H1 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <line
        x1="8"
        y1="5"
        x2="8"
        y2="9"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="8" cy="11" r="0.7" fill="currentColor" />
    </svg>
  );
}

function NoEntryIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
      <circle
        cx="17"
        cy="17"
        r="15"
        fill="none"
        stroke="#a63e08"
        strokeWidth="3"
      />
      <line
        x1="6.5"
        y1="6.5"
        x2="27.5"
        y2="27.5"
        stroke="#a63e08"
        strokeWidth="3"
      />
    </svg>
  );
}
