import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { trpc } from "@frontend/lib/trpc.ts";
import { Button } from "@frontend/components/ui/Button.tsx";
import { BarcodeLabel } from "@frontend/components/admin/BarcodeLabel.tsx";
import searchIcon from "@frontend/assets/icons/search-icon.svg";

export const Route = createFileRoute("/_authenticated/admin/barcodes")({
  component: AdminBarcodes,
});

const DEFAULT_WIDTH = 3;
const DEFAULT_HEIGHT = 1.5;

function parseDimension(value: string, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function AdminBarcodes() {
  const [query, setQuery] = useState("");
  const [widthInput, setWidthInput] = useState(String(DEFAULT_WIDTH));
  const [heightInput, setHeightInput] = useState(String(DEFAULT_HEIGHT));

  const width = parseDimension(widthInput, DEFAULT_WIDTH);
  const height = parseDimension(heightInput, DEFAULT_HEIGHT);

  const digits = query.replace(/\D/g, "");
  const isPhoneSearch = digits.length === 10;
  const isNameSearch =
    query.trim().length > 2 && !/^[\d\s-]+$/.test(query.trim());
  const shouldShowNoResults = isPhoneSearch || isNameSearch;

  const search = useQuery(
    trpc.lookup.search.queryOptions(
      { query: query.trim(), personType: "member" },
      { enabled: query.trim().length >= 2 },
    ),
  );

  const barcode = useMutation(trpc.admin.barcode.mutationOptions());
  const selectedId = barcode.variables?.personId;

  return (
    <main className="flex flex-1 flex-col gap-8 px-4 py-8 font-ubuntu text-black sm:px-12">
      <h1 className="text-3xl font-bold print:hidden">Member barcodes</h1>

      <div className="flex flex-col gap-8 lg:flex-row print:hidden">
        <section className="flex w-full max-w-xl flex-col gap-3">
          <label htmlFor="member-search" className="text-lg font-medium">
            Find a member by name or phone number
          </label>
          <div className="relative">
            <div className="absolute top-1/2 left-3 -translate-y-1/2">
              <img src={searchIcon} alt="" />
            </div>
            <input
              id="member-search"
              className="w-full rounded-xl border-2 border-gray-400 bg-white px-3 py-2.5 pl-10 text-lg outline-none placeholder:text-gray-500"
              type="text"
              maxLength={50}
              placeholder='ex: "John Williams" or "123-456-7890"'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {search.isError ? (
            <p className="rounded-xl bg-red-100 px-3 py-2.5 text-red-600">
              Something went wrong while searching. Please try again.
            </p>
          ) : search.data && search.data.length > 0 ? (
            <ul className="max-h-96 overflow-y-auto rounded-xl border border-gray-200 bg-white">
              {search.data.map((person) => (
                <li
                  key={person.id}
                  className="border-b border-gray-200 last:border-b-0"
                >
                  <button
                    type="button"
                    onClick={() => barcode.mutate({ personId: person.id })}
                    className={`flex w-full cursor-pointer items-center justify-between px-4 py-2 text-left hover:bg-gray-100 ${
                      person.id === selectedId ? "bg-gray-100" : ""
                    }`}
                  >
                    <span className="text-lg font-semibold">
                      {person.fullName}
                    </span>
                    {person.phoneLast4 && (
                      <span className="text-gray-500">
                        •••-•••-{person.phoneLast4}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            shouldShowNoResults &&
            search.isFetched &&
            !search.isFetching && (
              <p className="text-gray-600">No members found.</p>
            )
          )}
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex gap-4">
            <label className="flex flex-col gap-1">
              <span className="font-medium">Width (in)</span>
              <input
                type="number"
                min={0.5}
                step={0.1}
                value={widthInput}
                onChange={(e) => setWidthInput(e.target.value)}
                className="w-28 rounded-lg border-2 border-gray-400 px-2 py-1"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-medium">Height (in)</span>
              <input
                type="number"
                min={0.5}
                step={0.1}
                value={heightInput}
                onChange={(e) => setHeightInput(e.target.value)}
                className="w-28 rounded-lg border-2 border-gray-400 px-2 py-1"
              />
            </label>
          </div>

          {barcode.isPending && <p>Loading barcode…</p>}
          {barcode.isError && (
            <p className="rounded-xl bg-red-100 px-3 py-2.5 text-red-600">
              Couldn&apos;t load this member&apos;s barcode. Please try again.
            </p>
          )}
          {barcode.data && (
            <Button
              color="blue"
              className="self-start"
              onClick={() => window.print()}
            >
              Print
            </Button>
          )}
        </section>
      </div>

      {barcode.data && (
        <div className="barcode-print-area">
          <BarcodeLabel
            svg={barcode.data.svg}
            firstName={barcode.data.firstName}
            lastName={barcode.data.lastName}
            width={width}
            height={height}
          />
        </div>
      )}
    </main>
  );
}
