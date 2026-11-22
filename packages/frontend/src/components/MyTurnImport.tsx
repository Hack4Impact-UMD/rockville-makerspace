import { useRef, useState } from "react";

// matches what the myturn.importCsv endpoint returns
export type ImportSummary = {
  created: number;
  updated: number;
  skipped: { row: number; customerId: string | null; reason: string }[];
};

type Status =
  | { kind: "idle" }
  | { kind: "importing" }
  | { kind: "done"; fileName: string; summary: ImportSummary }
  | { kind: "failed"; message: string };

// an upload csv button that sends the picked file's text to `onImport`
// and shows the result
export function MyTurnImport({
  onImport,
}: {
  onImport: (csv: string) => Promise<ImportSummary>;
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function handleFile(file: File) {
    setStatus({ kind: "importing" });
    try {
      const summary = await onImport(await file.text());
      setStatus({ kind: "done", fileName: file.name, summary });
    } catch (error) {
      setStatus({
        kind: "failed",
        message: error instanceof Error ? error.message : "Import failed.",
      });
    }
  }

  const importing = status.kind === "importing";

  return (
    <div className="space-y-4">
      <input
        ref={fileInput}
        type="file"
        accept=".csv"
        hidden
        data-testid="csv-file"
        onChange={(event) => {
          const file = event.target.files?.[0];
          // cleared so picking the same file again still fires onChange
          event.target.value = "";
          if (file) void handleFile(file);
        }}
      />
      <button
        type="button"
        data-testid="upload-csv"
        disabled={importing}
        onClick={() => fileInput.current?.click()}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
      >
        {importing ? "Importing…" : "Upload CSV"}
      </button>

      {status.kind === "failed" && (
        <p
          role="alert"
          data-testid="import-error"
          className="text-sm text-red-600"
        >
          {status.message}
        </p>
      )}

      {status.kind === "done" && (
        <ImportResult fileName={status.fileName} summary={status.summary} />
      )}
    </div>
  );
}

function ImportResult({
  fileName,
  summary,
}: {
  fileName: string;
  summary: ImportSummary;
}) {
  return (
    <div data-testid="import-summary" className="space-y-3 text-sm">
      <p className="font-medium">{fileName}</p>
      <p>
        Created: <span data-testid="created-count">{summary.created}</span>
        {" · "}
        Updated: <span data-testid="updated-count">{summary.updated}</span>
        {" · "}
        Skipped:{" "}
        <span data-testid="skipped-count">{summary.skipped.length}</span>
      </p>

      {summary.skipped.length === 0 ? (
        <p className="text-slate-500">No rows were skipped.</p>
      ) : (
        <div>
          <h3 className="font-medium">Skipped rows</h3>
          <ul data-testid="skipped-rows" className="list-disc pl-5">
            {summary.skipped.map((skip) => (
              <li key={skip.row}>
                Row {skip.row}
                {skip.customerId !== null && ` (ID ${skip.customerId})`}:{" "}
                {skip.reason}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
