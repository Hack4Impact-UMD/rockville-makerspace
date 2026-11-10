import { createFileRoute } from "@tanstack/react-router";
import { trpc } from "@frontend/lib/trpc.ts";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import searchIcon from "@frontend/assets/icons/search-icon.svg";

export const Route = createFileRoute("/_check-in/member-search")({
  staticData: { backTo: "/" },
  component: MemberSearch,
});

function MemberSearch() {
  const [query, setQuery] = useState("");
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
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div>
        <div className="pl-30">
          <h1 className="text-white font-bold text-[40px] pt-10">
            Find your membership
          </h1>
          <div className="mt-7 flex flex-col gap-4">
            <p className="text-white text-[20px]">
              Start typing your name or phone number. This is for members only.
            </p>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <img src={searchIcon} alt="" />
              </div>
              <input
                className="w-200 border-1.5 border-2 border-b-black rounded-xl bg-white px-3 py-2.5 pl-10 pr-3 text-[30px] text-black font-medium shadow-lg outline-none placeholder:text-gray-500"
                type="text"
                maxLength={50}
                placeholder='ex: "John Williams" or "123-456-7890"'
                value={query}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^[\d-]*$/.test(value)) {
                    setQuery(formatPhoneNumber(value));
                  } else {
                    setQuery(value);
                  }
                }}
              />
            </div>

            {search.isError ? (
              <div className="bg-red-100 border border-gray-200 max-w-200 w-full text-[20px] font-medium px-3 py-2.5 pr-3 rounded-xl">
                <p className="text-red-500">
                  Something went wrong while searching. Please try again, or ask
                  our staff for help.
                </p>
              </div>
            ) : search.data && search.data.length > 0 ? (
              <div className="mt-3 w-full max-w-200 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                <div className="max-h-95 overflow-y-auto overflow-x-hidden">
                  {search.data.map((person) => (
                    <div
                      key={person.id}
                      className="flex w-full items-center justify-between border-b border-gray-200 px-4 py-2 last:border-b-0 hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-[15px] font-medium text-gray-600">
                          {person.fullName
                            .split(" ")
                            .map((name) => name[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>

                        <p className="text-[30px] font-semibold text-[#292929]">
                          {person.fullName}
                        </p>
                      </div>

                      {person.phoneLast4 && (
                        <p className="text-[20px] font-normal text-[#777777]">
                          •••-•••-{person.phoneLast4}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              shouldShowNoResults &&
              search.isFetched &&
              !search.isFetching && (
                <div className="bg-red-100 border border-gray-200 max-w-200 w-full text-[20px] font-medium px-3 py-2.5 pr-3 rounded-xl">
                  <p className="text-red-500">
                    We couldn&apos;t find your membership. Please try another
                    name or phone number. Our staff will be happy to help if you
                    need a hand!
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 10);

  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 6) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }

  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}
