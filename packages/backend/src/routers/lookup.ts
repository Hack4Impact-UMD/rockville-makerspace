import { COLLECTIONS, personSearchInput, phoneLast4 } from "@repo/common";
import type { PersonSearchResult } from "@repo/common";
import { publicProcedure, router } from "@backend/trpc/init.ts";

// code written emulating routers/notes.ts
export const lookupRouter = router({
  // creating a query that when given a personSearchInput, fetches from the collection
  search: publicProcedure
    .input(personSearchInput)
    .query(async ({ ctx, input }): Promise<PersonSearchResult[]> => {
      const snapshot = await ctx.db.collection(COLLECTIONS.people).get();
      const searchTerm = input.query.trim().toLowerCase();
      // fetching first, then filtering from snapshot
      // this is done so that we can use .includes(), which provides more accurate search results
      return snapshot.docs
        .map((doc): PersonSearchResult => {
          const data = doc.data();
          return {
            id: doc.id,
            personType: data.personType,
            // combining them to display the full name
            fullName: `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim(),
            phoneLast4: phoneLast4(data.phone ?? null),
          };
        })
        .filter((person) => {
          const matchesName = person.fullName
            .toLowerCase()
            .includes(searchTerm);
          const matchesType =
            !input.personType || person.personType === input.personType;
          // return only people who match the set type and whose name match the given search result
          return matchesName && matchesType;
        });
    }),
});
