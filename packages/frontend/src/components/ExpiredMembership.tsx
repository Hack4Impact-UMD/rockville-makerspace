import { useEffect, useRef, useState } from "react";
import { Button } from "@frontend/components/ui/Button.tsx";
import { Pill } from "@frontend/components/ui/shapes/Pill.tsx";
import noEntryIcon from "@frontend/assets/icons/no-entry.svg";
import patternBg from "@frontend/assets/images/backgrounds/makerspace-pattern-bg.png";

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
    // The message and the buttons share one grid cell so the message stays
    // centered on the whole screen while the buttons sit at the bottom.
    <div
      className="grid min-h-dvh bg-teal bg-cover bg-center px-[120px] py-10 font-ubuntu leading-[normal]"
      style={{ backgroundImage: `url(${patternBg})` }}
    >
      <div className="flex flex-col items-center gap-[18px] self-center [grid-area:1/1]">
        <img src={noEntryIcon} alt="" width={56} height={56} />
        <h1 className="text-[40px] font-bold text-white">WAIT, {firstName}!</h1>
        <Pill colorClass="border-[1.5px] border-warning bg-warning-bg text-warning shadow-raised">
          Inactive membership
        </Pill>
        <p
          role="alert"
          className="w-[603px] max-w-full rounded-[10px] bg-warning-bg px-5 py-4 text-xl text-warning"
        >
          Looks like your membership has lapsed. Please see the staff to help
          you renew before checking in.
        </p>
      </div>

      <div className="flex flex-wrap gap-7 self-end [grid-area:1/1]">
        <Button variant="secondary" size="lg" onClick={onGoBack}>
          Go back and fix check in
        </Button>
        <Button variant="primary" size="lg" onClick={onCheckInSomeoneElse}>
          Done! Let someone else check in({secondsLeft})
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
