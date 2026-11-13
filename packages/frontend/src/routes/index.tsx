import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { OptionButton } from "@frontend/components/ui/OptionButton.tsx";

// Uses the root layout's teal wallpaper and navbar.
export const Route = createFileRoute("/")({
  component: Home,
});

/** Phone layout by default; the kiosk (tablet) layout from the `sm` breakpoint up. */
function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-7 py-8 text-white sm:justify-start sm:px-10">
      <h1 className="text-center text-[28px] leading-none font-bold sm:text-[40px]">
        Welcome to the Makerspace!
        <span className="hidden sm:inline"> Let’s get you checked in.</span>
      </h1>

      <div className="grid w-full max-w-[852px] grid-cols-1 grid-rows-[repeat(3,123px)] gap-y-9 sm:grid-cols-2 sm:grid-rows-[237px_237px] sm:gap-x-6 sm:gap-y-16">
        <OptionButton
          title="Member"
          onClick={() => navigate({ to: "/member-search" })}
        />
        <OptionButton title="Not a member" />
        <OptionButton
          variant="outlined"
          className="sm:col-span-2"
          title="Check Out"
          description="Everyone, when you’re leaving"
        />
      </div>

      <p className="text-sm leading-none font-medium sm:text-xl sm:font-normal">
        Need help? <span className="underline">Ask the staff on duty</span>
      </p>
    </div>
  );
}
