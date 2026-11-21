import { useEffect, useRef, useState } from "react";

/**
 * Counts down from `seconds` once per second and calls `onDone` when it
 * reaches 0. Returns the seconds left.
 */
export function useCountdown(seconds: number, onDone: () => void): number {
  const [secondsLeft, setSecondsLeft] = useState(seconds);

  // Read through a ref so a new callback identity doesn't restart the timer.
  const onTimeout = useRef(onDone);
  useEffect(() => {
    onTimeout.current = onDone;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((s) => Math.max(s - 1, 0));
    }, 1000);
    return () => clearInterval(timer); // stop the timer when the screen unmounts
  }, []);

  useEffect(() => {
    if (secondsLeft === 0) onTimeout.current();
  }, [secondsLeft]);

  return secondsLeft;
}
