import Dexie, { type Table } from "dexie";

export interface CacheItem<T> {
  key: string;
  value: T;
  expires: number;
}

const DB_NAME = "knowde-cache";
const TABLE_NAME = "search-results";
const TTL = 1000 * 60 * 60 * 24; // 24 hours

class KnowdeCacheDB extends Dexie {
  public searchResults!: Table<CacheItem<unknown>>;

  public constructor() {
    super(DB_NAME);
    this.version(1).stores({
      [TABLE_NAME]: "&key, expires",
    });
    this.searchResults = this.table(TABLE_NAME);
  }
}

export const db = new KnowdeCacheDB();

async function cleanup() {
  const now = Date.now();
  await db.searchResults.where("expires").below(now).delete();
}

// await cleanup();

export async function getCache<T>(key: string): Promise<T | undefined> {
  const now = Date.now();
  const item = await db.searchResults.get(key);
  if (item && item.expires > now) {
    return item.value as T;
  }
  if (item) {
    await db.searchResults.delete(key);
  }

  return undefined;
}

export async function setCache<T>(key: string, value: T): Promise<void> {
  const item: CacheItem<T> = {
    key,
    value,
    expires: Date.now() + TTL,
  };
  await db.searchResults.put(item);
}

export async function getAllCacheKeys(): Promise<string[]> {
  return (await db.searchResults.toCollection().keys()) as string[];
}
