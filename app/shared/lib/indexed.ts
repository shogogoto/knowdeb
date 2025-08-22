import Dexie, { type Table } from "dexie";
import type {
  KnowdeDetail,
  KnowdeSearchResult,
} from "~/shared/generated/fastAPI.schemas";
import type { HistoryItemType } from "../history/types";

// --- 共通の定義 ---
export interface CacheItem<T> {
  key: string;
  value: T;
  expires: number;
}
const TTL = 1000 * 60 * 60 * 24; // 24 hours
const HISTORY_MAX = 100;

class KnowdeCacheDB extends Dexie {
  public cache!: Table<CacheItem<unknown>>;
  public knowdeDetails!: Table<KnowdeDetail>;
  public knowdeSearchResults!: Table<CacheItem<KnowdeSearchResult>>;
  public history!: Table<HistoryItemType>;

  public constructor() {
    super("knowde-cache");
    this.version(2).stores({
      cache: "&key, expires",
      knowdeDetails: "&uid",
      knowdeSearchResults: "&key, expires",
      history: "++id, type, timestamp, url",
    });
  }
}

export const db = new KnowdeCacheDB();

/**
 * TTL（有効期限）付きのキャッシュストアを生成するファクトリ
 */
function createTTLStore<T>(table: Table<CacheItem<T>>) {
  async function cleanup() {
    const now = Date.now();
    await table.where("expires").below(now).delete();
  }

  return {
    async get(key: string): Promise<T | undefined> {
      const item = await table.get(key);
      if (item && item.expires > Date.now()) {
        return item.value;
      }
      if (item) await table.delete(key); // 期限切れを削除
      return undefined;
    },
    async set(key: string, value: T): Promise<void> {
      await table.put({ key, value, expires: Date.now() + TTL });
      await cleanup();
    },
    clear: () => table.clear(),
    count: () => table.count(),
  };
}

function createEntityStore<T>(table: Table<T>) {
  // Dexieのプライマリキーは string | number | Date | ArrayBuffer
  type KeyType = string | number;
  return {
    get: (id: KeyType) => table.get(id),
    set: (entity: T) => table.put(entity),
    delete: (id: KeyType) => table.delete(id),
    clear: () => table.clear(),
    count: () => table.count(),
  };
}

function createHistoryStore(table: Table<HistoryItemType>) {
  return {
    async add(item: Omit<HistoryItemType, "id" | "timestamp">): Promise<void> {
      const existing = await table.where({ url: item.url }).first();
      if (existing?.id) {
        await table.delete(existing.id);
      }

      await table.add({
        ...item,
        timestamp: Date.now(),
      });

      const count = await table.count();
      if (count > HISTORY_MAX) {
        const toDelete = await table
          .orderBy("timestamp")
          .limit(count - HISTORY_MAX)
          .toArray();
        const idsToDelete = toDelete
          .map((h) => h.id)
          .filter((id): id is number => id !== undefined);
        await table.bulkDelete(idsToDelete);
      }
    },
    getAll: () => table.orderBy("timestamp").reverse().toArray(),
    clear: () => table.clear(),
  };
}

// --- 具体的なキャッシュストアのインスタンス化 ---
export const genericCache = createTTLStore(db.cache);
export const knowdeSearchCache = createTTLStore<KnowdeSearchResult>(
  db.knowdeSearchResults,
);
export const knowdeDetailCache = createEntityStore<KnowdeDetail>(
  db.knowdeDetails,
);
export const historyStore = createHistoryStore(db.history);
