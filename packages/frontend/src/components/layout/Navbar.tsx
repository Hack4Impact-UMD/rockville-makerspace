import { BackArrow } from "@frontend/components/ui/BackArrow.tsx";
import { useMatches } from "@tanstack/react-router";
import { Clock } from "@frontend/components/layout/Clock.tsx";

export function Navbar() {
  const backTo = useMatches({
    select: (matches) => matches.at(-1)?.staticData.backTo,
  });

  return (
    <header className="flex items-center bg-white py-[23px] px-10 w-full h-[79px] justify-between border-b border-[#565656] sm:py-[28px] sm:px-[48px] sm:h-[96px]">
      <nav className="flex items-center gap-[13px] text-black sm:gap-[16px]">
        {backTo && <BackArrow to={backTo} />}
        <div className="flex size-[33px] shrink-0 items-center justify-center rounded-md bg-white sm:size-10 sm:rounded-lg">
          <p className="text-[9px] leading-none font-semibold sm:text-[11px]">
            RMS
          </p>
        </div>
        <p className="text-[11.5px] leading-none font-medium sm:text-[20px] sm:font-normal">
          Rockville Makerspace
        </p>
      </nav>
      <Clock />
    </header>
  );
}
