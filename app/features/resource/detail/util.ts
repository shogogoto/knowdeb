import type Graph from "graphology";
import type {
  EdgeType,
  Knowde,
  ResourceDetailTerms,
  ResourceDetailUids,
} from "~/shared/generated/fastAPI.schemas";
import { eqEdgeType, pathsToEnd, pred, succ } from "~/shared/lib/network";

export function toTree(g: Graph, root: string) {
  const tops = succ(g, root, eqEdgeType("below"));
  for (const head of tops) {
    const sib_paths = pathsToEnd(g, head, eqEdgeType("sibling"), succ);
    // const heads2 = succ(g, root, eqEdgeType("below"));
    for (const sib_path of sib_paths) {
    }
  }
  return tops.map((head) => {
    const sib_paths = pathsToEnd(g, head, eqEdgeType("sibling"), succ);
    return {
      // [head]: ,
    };
  });
}

type ResourceKnowde = Omit<Knowde, "stats" | "resource_uid">;

export function toAdjacent(
  id: string,
  g: Graph,
  uids: ResourceDetailUids,
  terms: ResourceDetailTerms,
) {
  // @ts-ignore
  const when = succ(g, id, eqEdgeType("when")).map((wid) => uids[wid])?.[0]?.n;
  const additional = when && { when };
  const kn: ResourceKnowde = {
    sentence: (uids[id] as string) ?? "<<<not defined>>>",
    term: terms[id],
    uid: id,
    additional,
  };

  function toSucc(et: EdgeType) {
    return succ(g, id, eqEdgeType(et)).map((sid) =>
      toAdjacent(sid, g, uids, terms),
    );
  }

  function toPred(et: EdgeType) {
    return pred(g, id, eqEdgeType(et)).map((sid) =>
      toAdjacent(sid, g, uids, terms),
    );
  }

  function toEnd(et: EdgeType) {
    return pathsToEnd(g, id, eqEdgeType(et), succ).map((path) => {
      return path.map((sid) => toAdjacent(sid, g, uids, terms));
    });
  }

  // 1つ下の階層の一覧を返す
  function downArrays() {
    const retval: ResourceKnowde[][] = [];
    for (const below of toSucc("below")) {
      const sibs = below.toEnd("sibling")[0]?.map((e) => e.kn);
      sibs && retval.push(sibs);
    }
    return retval;
  }

  return {
    kn,
    toSucc,
    toPred,
    toEnd,
    siblings: () => toSucc("sibling"),
    belows: () => toSucc("below"),
    downArrays,
    conclusions: () => toSucc("to"),
    premises: () => toPred("to"),
    refers: () => toSucc("resolved"),
    referreds: () => toPred("resolved"),
  };
}

// below と sibling を 再帰的に返す
//  まずは headerのツリーを作成したい
export function toDetailTree() {}

// 再帰的に周辺を辿ると無限ループになるので
// 一度辿ったものか否かを判定する
export function useTraceMemory() {
  const tracememory = new Set<string>();

  function register(id: string) {
    tracememory.add(id);
  }

  function isRegistered(id: string) {
    return tracememory.has(id);
  }

  return {
    register,
    isRegistered,
  };
}

export function isHeading(id: string, uids: ResourceDetailUids) {
  return uids[id]?.toString().startsWith("#");
}
