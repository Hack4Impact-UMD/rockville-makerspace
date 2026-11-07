import { createFileRoute } from "@tanstack/react-router";
import warningIcon from "@frontend/assets/icons/warning-icon.png";
import backgroundImage from "@frontend/assets/images/backgrounds/background-image.png";
import { WaiverContainer } from "@frontend/components/check-in/WaiverContainer.tsx";

export const Route = createFileRoute("/waiver-needed")({
  staticData: { backTo: "/" },
  component: WaiverNeeded,
});

function WaiverNeeded() {
  return (
    <main
      className="font-ubuntu min-h-dvh bg-[#0B7285] bg-cover bg-center bg-no-repeat px-5 py-12 sm:px-10 sm:py-16"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="mx-auto max-w-[1200px]">
        <header className="mb-6 text-center text-white">
          <h1 className="flex items-start justify-center gap-3 text-3xl leading-tight font-bold sm:items-center sm:gap-5 sm:text-5xl">
            <img
              src={warningIcon}
              alt=""
              aria-hidden="true"
              className="mt-1 h-9 w-10 shrink-0 object-contain sm:mt-0 sm:h-11 sm:w-12"
            />
            <span>One quick thing before you head in</span>
          </h1>
          <p className="mt-6 text-xl leading-tight font-semibold sm:text-3xl">
            We need a current safety waiver on file.
            <br />
            Please sign our waiver to continue.
          </p>
        </header>
        <WaiverContainer />
      </div>
    </main>
  );
}
