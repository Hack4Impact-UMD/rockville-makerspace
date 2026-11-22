import type { Firestore } from "firebase-admin/firestore";

type Doc = Record<string, unknown>;
type Ref = { path: string };

// applies an update like { "membership.syncedAt": 1 } to nested fields
function setByPath(data: Doc, path: string, value: unknown) {
  const keys = path.split(".");
  const last = keys.pop() ?? "";
  let target = data;
  for (const key of keys) {
    target[key] = { ...(target[key] as Doc) };
    target = target[key] as Doc;
  }
  target[last] = value;
}

// in-memory stand-in for firestore for tests, only what the myturn import
// uses. ci's unit tests run without the emulator.
export function fakeFirestore() {
  const store = new Map<string, Doc>();
  const batchSizes: number[] = [];

  const db = {
    collection: (name: string) => ({
      doc: (id: string): Ref => ({ path: `${name}/${id}` }),
    }),
    getAll: (...refs: Ref[]) =>
      Promise.resolve(
        refs.map((ref) => ({ ref, exists: store.has(ref.path) })),
      ),
    // writes are saved only on commit, like a real batch
    batch: () => {
      const writes: (() => void)[] = [];
      return {
        set: (ref: Ref, data: Doc) => {
          writes.push(() => store.set(ref.path, structuredClone(data)));
        },
        update: (ref: Ref, data: Doc) => {
          writes.push(() => {
            const existing = store.get(ref.path);
            if (existing === undefined) throw new Error(`no doc ${ref.path}`);
            const updated = structuredClone(existing);
            for (const [path, value] of Object.entries(data)) {
              setByPath(updated, path, value);
            }
            store.set(ref.path, updated);
          });
        },
        commit: () => {
          batchSizes.push(writes.length);
          writes.forEach((write) => write());
          return Promise.resolve();
        },
      };
    },
  } as unknown as Firestore;

  return { db, store, batchSizes };
}
