/**
 * Generated by orval v7.8.0 🍺
 * Do not edit manually.
 * FastAPI
 * OpenAPI spec version: 0.1.0
 */
import { z as zod } from "zod";

/**
 * 文字列検索.
 * @summary Search By Text
 */
export const searchByTextKnowdeGetQueryQDefault = "";
export const searchByTextKnowdeGetQueryTypeDefault = "CONTAINS";
export const searchByTextKnowdeGetQueryPageDefault = 1;
export const searchByTextKnowdeGetQuerySizeDefault = 100;
export const searchByTextKnowdeGetQueryNDetailDefault = 1;
export const searchByTextKnowdeGetQueryNPremiseDefault = 3;
export const searchByTextKnowdeGetQueryNConclusionDefault = 3;
export const searchByTextKnowdeGetQueryNReferDefault = 3;
export const searchByTextKnowdeGetQueryNReferredDefault = 3;
export const searchByTextKnowdeGetQueryDistAxiomDefault = 1;
export const searchByTextKnowdeGetQueryDistLeafDefault = 1;
export const searchByTextKnowdeGetQueryDescDefault = true;

export const searchByTextKnowdeGetQueryParams = zod.object({
  q: zod.string().optional(),
  type: zod
    .enum(["CONTAINS", "STARTS_WITH", "ENDS_WITH", "REGEX", "EQUAL"])
    .default(searchByTextKnowdeGetQueryTypeDefault),
  page: zod.number().default(searchByTextKnowdeGetQueryPageDefault),
  size: zod.number().default(searchByTextKnowdeGetQuerySizeDefault),
  n_detail: zod.number().default(searchByTextKnowdeGetQueryNDetailDefault),
  n_premise: zod.number().default(searchByTextKnowdeGetQueryNPremiseDefault),
  n_conclusion: zod
    .number()
    .default(searchByTextKnowdeGetQueryNConclusionDefault),
  n_refer: zod.number().default(searchByTextKnowdeGetQueryNReferDefault),
  n_referred: zod.number().default(searchByTextKnowdeGetQueryNReferredDefault),
  dist_axiom: zod.number().default(searchByTextKnowdeGetQueryDistAxiomDefault),
  dist_leaf: zod.number().default(searchByTextKnowdeGetQueryDistLeafDefault),
  desc: zod.boolean().default(searchByTextKnowdeGetQueryDescDefault),
});

export const searchByTextKnowdeGetResponseStatsNDetailMin = -100;

export const searchByTextKnowdeGetResponseStatsNDetailMax = 1000;
export const searchByTextKnowdeGetResponseStatsNPremiseMin = -100;

export const searchByTextKnowdeGetResponseStatsNPremiseMax = 1000;
export const searchByTextKnowdeGetResponseStatsNConclusionMin = -100;

export const searchByTextKnowdeGetResponseStatsNConclusionMax = 1000;
export const searchByTextKnowdeGetResponseStatsNReferMin = -100;

export const searchByTextKnowdeGetResponseStatsNReferMax = 1000;
export const searchByTextKnowdeGetResponseStatsNReferredMin = -100;

export const searchByTextKnowdeGetResponseStatsNReferredMax = 1000;
export const searchByTextKnowdeGetResponseStatsDistAxiomMin = -100;

export const searchByTextKnowdeGetResponseStatsDistAxiomMax = 1000;
export const searchByTextKnowdeGetResponseStatsDistLeafMin = -100;

export const searchByTextKnowdeGetResponseStatsDistLeafMax = 1000;
export const searchByTextKnowdeGetResponseStatsScoreMinOne = -100;
export const searchByTextKnowdeGetResponseStatsScoreMaxOne = 1000;

export const searchByTextKnowdeGetResponseItem = zod
  .object({
    center: zod
      .object({
        sentence: zod.string(),
        uid: zod.string().uuid(),
        term: zod
          .object({
            names: zod.array(zod.string()).optional(),
            alias: zod
              .string()
              .or(zod.null())
              .optional()
              .describe("参照用の無意味な記号(参照を持たない)"),
          })
          .describe("用語.")
          .or(zod.null())
          .optional(),
      })
      .describe("知識の最小単位."),
    when: zod.string().or(zod.null()).optional(),
    details: zod
      .array(
        zod
          .object({
            sentence: zod.string(),
            uid: zod.string().uuid(),
            term: zod
              .object({
                names: zod.array(zod.string()).optional(),
                alias: zod
                  .string()
                  .or(zod.null())
                  .optional()
                  .describe("参照用の無意味な記号(参照を持たない)"),
              })
              .describe("用語.")
              .or(zod.null())
              .optional(),
          })
          .describe("知識の最小単位."),
      )
      .optional(),
    premises: zod
      .array(
        zod
          .object({
            sentence: zod.string(),
            uid: zod.string().uuid(),
            term: zod
              .object({
                names: zod.array(zod.string()).optional(),
                alias: zod
                  .string()
                  .or(zod.null())
                  .optional()
                  .describe("参照用の無意味な記号(参照を持たない)"),
              })
              .describe("用語.")
              .or(zod.null())
              .optional(),
          })
          .describe("知識の最小単位."),
      )
      .optional(),
    conclusions: zod
      .array(
        zod
          .object({
            sentence: zod.string(),
            uid: zod.string().uuid(),
            term: zod
              .object({
                names: zod.array(zod.string()).optional(),
                alias: zod
                  .string()
                  .or(zod.null())
                  .optional()
                  .describe("参照用の無意味な記号(参照を持たない)"),
              })
              .describe("用語.")
              .or(zod.null())
              .optional(),
          })
          .describe("知識の最小単位."),
      )
      .optional(),
    refers: zod
      .array(
        zod
          .object({
            sentence: zod.string(),
            uid: zod.string().uuid(),
            term: zod
              .object({
                names: zod.array(zod.string()).optional(),
                alias: zod
                  .string()
                  .or(zod.null())
                  .optional()
                  .describe("参照用の無意味な記号(参照を持たない)"),
              })
              .describe("用語.")
              .or(zod.null())
              .optional(),
          })
          .describe("知識の最小単位."),
      )
      .optional(),
    referreds: zod
      .array(
        zod
          .object({
            sentence: zod.string(),
            uid: zod.string().uuid(),
            term: zod
              .object({
                names: zod.array(zod.string()).optional(),
                alias: zod
                  .string()
                  .or(zod.null())
                  .optional()
                  .describe("参照用の無意味な記号(参照を持たない)"),
              })
              .describe("用語.")
              .or(zod.null())
              .optional(),
          })
          .describe("知識の最小単位."),
      )
      .optional(),
    stats: zod
      .object({
        n_detail: zod
          .number()
          .min(searchByTextKnowdeGetResponseStatsNDetailMin)
          .max(searchByTextKnowdeGetResponseStatsNDetailMax),
        n_premise: zod
          .number()
          .min(searchByTextKnowdeGetResponseStatsNPremiseMin)
          .max(searchByTextKnowdeGetResponseStatsNPremiseMax),
        n_conclusion: zod
          .number()
          .min(searchByTextKnowdeGetResponseStatsNConclusionMin)
          .max(searchByTextKnowdeGetResponseStatsNConclusionMax),
        n_refer: zod
          .number()
          .min(searchByTextKnowdeGetResponseStatsNReferMin)
          .max(searchByTextKnowdeGetResponseStatsNReferMax),
        n_referred: zod
          .number()
          .min(searchByTextKnowdeGetResponseStatsNReferredMin)
          .max(searchByTextKnowdeGetResponseStatsNReferredMax),
        dist_axiom: zod
          .number()
          .min(searchByTextKnowdeGetResponseStatsDistAxiomMin)
          .max(searchByTextKnowdeGetResponseStatsDistAxiomMax),
        dist_leaf: zod
          .number()
          .min(searchByTextKnowdeGetResponseStatsDistLeafMin)
          .max(searchByTextKnowdeGetResponseStatsDistLeafMax),
        score: zod
          .number()
          .min(searchByTextKnowdeGetResponseStatsScoreMinOne)
          .max(searchByTextKnowdeGetResponseStatsScoreMaxOne)
          .or(zod.null())
          .optional(),
      })
      .describe("知識の関係統計.")
      .or(zod.null())
      .optional(),
  })
  .describe("周辺情報も含める.");
export const searchByTextKnowdeGetResponse = zod.array(
  searchByTextKnowdeGetResponseItem,
);
