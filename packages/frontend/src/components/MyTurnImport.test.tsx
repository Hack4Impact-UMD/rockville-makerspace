import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MyTurnImport } from "@frontend/components/MyTurnImport.tsx";
import type { ImportSummary } from "@frontend/components/MyTurnImport.tsx";

afterEach(cleanup);

const csvText = "customerID,firstName,lastName\n1042,Ana,Diaz";

function pickFile(text = csvText, name = "members.csv") {
  const file = new File([text], name, { type: "text/csv" });
  fireEvent.change(screen.getByTestId("csv-file"), {
    target: { files: [file] },
  });
}

describe("MyTurnImport", () => {
  it("has a hidden file input that only accepts .csv", () => {
    render(
      <MyTurnImport
        onImport={vi.fn<(csv: string) => Promise<ImportSummary>>()}
      />,
    );

    const input = screen.getByTestId("csv-file");
    expect(input).toHaveAttribute("accept", ".csv");
    expect(input).not.toBeVisible();
    expect(screen.getByTestId("upload-csv")).toHaveTextContent("Upload CSV");
  });

  it("opens the file picker when the button is clicked", () => {
    render(
      <MyTurnImport
        onImport={vi.fn<(csv: string) => Promise<ImportSummary>>()}
      />,
    );
    const click = vi.spyOn(screen.getByTestId("csv-file"), "click");

    fireEvent.click(screen.getByTestId("upload-csv"));

    expect(click).toHaveBeenCalled();
  });

  it("sends the file's text and shows the summary", async () => {
    const onImport = vi.fn<(csv: string) => Promise<ImportSummary>>(() =>
      Promise.resolve({
        created: 12,
        updated: 230,
        skipped: [
          { row: 7, customerId: "1050", reason: 'invalid email "ana@"' },
          { row: 9, customerId: null, reason: "missing Customer ID" },
        ],
      }),
    );
    render(<MyTurnImport onImport={onImport} />);

    pickFile();

    expect(await screen.findByTestId("import-summary")).toHaveTextContent(
      "members.csv",
    );
    expect(onImport).toHaveBeenCalledWith(csvText);
    expect(screen.getByTestId("created-count")).toHaveTextContent("12");
    expect(screen.getByTestId("updated-count")).toHaveTextContent("230");
    expect(screen.getByTestId("skipped-count")).toHaveTextContent("2");
    expect(screen.getByTestId("skipped-rows")).toHaveTextContent(
      'Row 7 (ID 1050): invalid email "ana@"',
    );
    expect(screen.getByTestId("skipped-rows")).toHaveTextContent(
      "Row 9: missing Customer ID",
    );
  });

  it("says when no rows were skipped", async () => {
    render(
      <MyTurnImport
        onImport={() =>
          Promise.resolve({ created: 1, updated: 0, skipped: [] })
        }
      />,
    );

    pickFile();

    expect(await screen.findByTestId("import-summary")).toHaveTextContent(
      "No rows were skipped.",
    );
  });

  it("disables the button while importing", async () => {
    let finish: (summary: ImportSummary) => void = () => {};
    render(
      <MyTurnImport
        onImport={() => new Promise((resolve) => (finish = resolve))}
      />,
    );

    pickFile();

    const button = screen.getByTestId("upload-csv");
    expect(await screen.findByText("Importing…")).toBeDisabled();
    finish({ created: 0, updated: 0, skipped: [] });
    expect(await screen.findByText("Upload CSV")).toBe(button);
    expect(button).toBeEnabled();
  });

  it("shows the error when the file is rejected", async () => {
    render(
      <MyTurnImport
        onImport={() =>
          Promise.reject(new Error("Missing required column(s): Customer ID."))
        }
      />,
    );

    pickFile();

    expect(await screen.findByTestId("import-error")).toHaveTextContent(
      "Missing required column(s): Customer ID.",
    );
    expect(screen.queryByTestId("import-summary")).toBeNull();
  });
});
