import { useEffect, useState } from "react";

const dateFormat = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
});

const timeFormat = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

/** Current date and time, updated every second. */
export function Clock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id); // stop the timer when the clock unmounts
  }, []);

  return (
    <time
      dateTime={now.toISOString()}
      className="text-black text-[11.5px] leading-none font-medium sm:text-[20px] sm:font-normal"
    >
      {dateFormat.format(now)} · {timeFormat.format(now)}
    </time>
  );
}
