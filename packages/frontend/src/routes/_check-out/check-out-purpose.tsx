import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_check-out/check-out-purpose")({
  component: CheckOutPurpose,
});

function CheckOutPurpose() {
  return null;
}
