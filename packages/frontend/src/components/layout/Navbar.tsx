import { BackArrow } from "@frontend/components/ui/BackArrow.tsx";
import { useMatches } from "@tanstack/react-router";
import { Clock } from "@frontend/components/layout/Clock.tsx";

export function Navbar() {
  const backTo = useMatches({
    select: (matches) => matches.at(-1)?.staticData.backTo,
  });

  return (
    <header className="flex items-center bg-white py-[28px] px-[48px] w-full h-[96px] justify-between border-b border-[#565656]">
      <nav className="flex items-center gap-[16px] text-black">
        {backTo && <BackArrow to={backTo} />}
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white">
          <p className="text-[11px] leading-none font-semibold">RMS</p>
        </div>
        <p className="text-[20px] leading-none">Rockville Makerspace</p>
      </nav>
      <Clock />
    </header>
  );
}
