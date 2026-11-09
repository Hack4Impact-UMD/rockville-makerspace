import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  AUTO_RETURN_SECONDS,
  ExpiredMembership,
} from "@frontend/components/ExpiredMembership.tsx";

describe("ExpiredMembership", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  function renderScreen() {
    const onGoBack = vi.fn<() => void>();
    const onCheckInSomeoneElse = vi.fn<() => void>();
    render(
      <ExpiredMembership
        firstName="Priya"
        onGoBack={onGoBack}
        onCheckInSomeoneElse={onCheckInSomeoneElse}
      />,
    );
    return { onGoBack, onCheckInSomeoneElse };
  }

  it("renders the lapsed membership message", () => {
    renderScreen();

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("WAIT, Priya!")).toBeInTheDocument();
    expect(screen.getByText(/membership has lapsed/)).toBeInTheDocument();
    expect(screen.getByText("Inactive membership")).toBeInTheDocument();
  });

  it("wires up both buttons", () => {
    const { onGoBack, onCheckInSomeoneElse } = renderScreen();

    fireEvent.click(
      screen.getByRole("button", { name: "Go back and fix check in" }),
    );
    fireEvent.click(screen.getByRole("button", { name: /someone else/ }));

    expect(onGoBack).toHaveBeenCalledOnce();
    expect(onCheckInSomeoneElse).toHaveBeenCalledOnce();
  });

  it("counts down and moves on when it reaches zero", () => {
    const { onCheckInSomeoneElse } = renderScreen();
    const button = screen.getByRole("button", { name: /someone else/ });

    expect(button).toHaveTextContent(`(${AUTO_RETURN_SECONDS})`);
    act(() => vi.advanceTimersByTime(3000));
    expect(button).toHaveTextContent(`(${AUTO_RETURN_SECONDS - 3})`);
    expect(onCheckInSomeoneElse).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(AUTO_RETURN_SECONDS * 1000));
    expect(button).toHaveTextContent("(0)");
    expect(onCheckInSomeoneElse).toHaveBeenCalledOnce();
  });
});
