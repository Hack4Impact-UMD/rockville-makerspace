
import { createFileRoute, Link } from "@tanstack/react-router";

import wifiOffIcon from "@frontend/assets/icons/wifi-off.svg";

export const Route = createFileRoute("/no-wifi")({
  component: NoWifi,
});

function NoWifi() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Mobile-only back arrow */}
      <header className="flex h-[55px] w-full shrink-0 items-center sm:hidden">
        <div className="flex w-[189px] shrink-0 items-center gap-2">
          <Link
            to="/member-search"
            aria-label="Go back"
            className="flex h-7 w-7 shrink-0 items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
            >
              <path
                d="M22.1673 13.9997H5.83398M14.0007 5.83301L5.83398 13.9997L14.0007 22.1663"
                stroke="white"
                strokeWidth="2.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </header>

      {/* No-Wi-Fi content */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-10 font-ubuntu sm:px-[120px]">
        <div className="flex w-full flex-col items-center gap-7">
          <img
            src={wifiOffIcon}
            alt="Wi-Fi disconnected"
            className="h-56 w-56 shrink-0 object-contain"
          />

          <div className="w-full rounded-[10px] border-2 border-[#EB0000] bg-white px-5 py-4 text-center shadow-[0_4px_14px_rgba(0,0,0,0.25),0_4px_4px_rgba(0,0,0,0.25)] sm:w-[678px]">
            <p className="text-[22px] leading-tight font-medium text-[#EB0000] sm:text-[32px]">
              Uh oh! Looks like you aren't connected to the internet. Speak to a
              staff member!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
