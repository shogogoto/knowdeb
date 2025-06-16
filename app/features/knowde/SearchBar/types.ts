export type OrderBy = {
  n_detail?: number;
  n_premise?: number;
  n_conclusion?: number;
  n_refer?: number;
  n_referred?: number;
  dist_axiom?: number;
  dist_leaf?: number;
  desc?: boolean;
};

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
