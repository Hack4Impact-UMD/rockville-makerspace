
import { createFileRoute } from "@tanstack/react-router";

import wifiOffIcon from "@frontend/assets/icons/wifi-off.svg";

export const Route = createFileRoute("/no-wifi")({
  component: NoWifi,
});

function NoWifi() {
  return (
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
  );
}
