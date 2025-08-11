import Dexie, { type Table } from "dexie";
import type {
  KnowdeDetail,
  KnowdeSearchResult,
} from "~/generated/fastAPI.schemas";

// --- 共通の定義 ---
export interface CacheItem<T> {
  key: string;
  value: T;
  expires: number;
}
const TTL = 1000 * 60 * 60 * 24; // 24 hours

class KnowdeCacheDB extends Dexie {
  public cache!: Table<CacheItem<unknown>>;
  public knowdeDetails!: Table<KnowdeDetail>;
  public knowdeSearchResults!: Table<CacheItem<KnowdeSearchResult>>;

  public constructor() {
    super("knowde-cache");
    this.version(2).stores({
      cache: "&key, expires",
      knowdeDetails: "&uid",
      knowdeSearchResults: "&key, expires",
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

// --- その他のユーティリティ ---
export async function clearAllCache(): Promise<void> {
  await Promise.all([
    genericCache.clear(),
    knowdeSearchCache.clear(),
    knowdeDetailCache.clear(),
  ]);
}
