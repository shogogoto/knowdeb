/**
 * Generated by orval v7.9.0 🍺
 * Do not edit manually.
 * FastAPI
 * OpenAPI spec version: 0.1.0
 */
import { z as zod } from "zod";

/**
 * ユーザーの名前空間.
 * @summary Get Namaspace
 */
export const getNamaspaceNamespaceGetResponse = zod
  .object({
    g: zod
      .object({
        directed: zod.boolean(),
        edges: zod.array(
          zod
            .object({
              source: zod.string(),
              target: zod.string(),
            })
            .describe("for fastapi schema."),
        ),
        graph: zod.record(zod.string(), zod.any()),
        multigraph: zod.boolean(),
        nodes: zod.array(zod.record(zod.string(), zod.string())),
      })
      .optional()
      .describe("for fastapi schema."),
    roots_: zod.record(
      zod.string(),
      zod
        .object({
          name: zod.string(),
          element_id_property: zod.string().or(zod.null()).optional(),
          uid: zod.string().uuid(),
        })
        .describe("namespace用のhashableな表現."),
    ),
    user_id: zod.string().uuid(),
  })
  .describe("リソースの分類.");

/**
 * ファイルシステムと同期.
 * @summary Sync Paths
 */
export const syncPathsNamespacePostBodyItem = zod
  .object({
    title: zod.string(),
    authors: zod.array(zod.string()).optional(),
    published: zod.string().date().or(zod.null()).optional(),
    urls: zod.array(zod.string()).optional(),
    path: zod.array(zod.string()).min(1).or(zod.null()).optional(),
    updated: zod.string().datetime({}).or(zod.null()).optional(),
    txt_hash: zod.number().or(zod.null()).optional(),
  })
  .describe("リソースメタ情報.");
export const syncPathsNamespacePostBody = zod.array(
  syncPathsNamespacePostBodyItem,
);

export const syncPathsNamespacePostResponseItem = zod.string();
export const syncPathsNamespacePostResponse = zod.array(
  syncPathsNamespacePostResponseItem,
);
