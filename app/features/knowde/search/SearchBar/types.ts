import type { SearchByTextKnowdeGetParams } from "~/shared/generated/fastAPI.schemas";

export type OrderBy = Omit<
  SearchByTextKnowdeGetParams,
  "user" | "q" | "type" | "page" | "size"
>;

export const defaultOrderBy: OrderBy = {
  n_detail: 1,
  n_premise: 1,
  n_conclusion: 1,
  n_refer: 1,
  n_referred: 1,
  dist_axiom: 1,
  dist_leaf: 1,
  desc: true,
};
