import Dexie, { type Table } from "dexie";
import type { KnowdeDetail } from "~/generated/fastAPI.schemas";

export class KnowdeCacheDB extends Dexie {
  knowdeDetails!: Table<KnowdeDetail & { id: string }>;

  constructor() {
    super("knowdeCache");
    this.version(1).stores({
      knowdeDetails: "&id", // Primary key
    });
  }
}

export const db = new KnowdeCacheDB();

export async function getKnowdeCacheCount() {
  return await db.knowdeDetails.count();
}
