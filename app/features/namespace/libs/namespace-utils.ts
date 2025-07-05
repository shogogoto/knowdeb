import type { Entry, NameSpace } from "~/generated/fastAPI.schemas";

export interface ResourceNode extends Entry {
  authors?: string[];
  published?: string;
  urls?: string[];
  path?: string | null;
  updated?: string;
  txt_hash?: number;
  type: "resource";
}

export interface FolderNode extends Entry {
  type: "folder";
  children: NamespaceNode[];
}

export type NamespaceNode = ResourceNode | FolderNode;

interface GraphNodeWithId {
  id: Entry & Partial<ResourceNode>;
}

export function buildNamespaceTree(data: NameSpace): FolderNode[] {
  const nodesMap = new Map<string, NamespaceNode>();
  const rootNodes: FolderNode[] = [];

  // Initialize all nodes as either FolderNode or ResourceNode
  data.g?.nodes.forEach((graphNode: GraphNodeWithId) => {
    const entryData = graphNode.id; // This is the actual Entry or ResourceNode data
    const isResource = "authors" in entryData && "published" in entryData;
    if (isResource) {
      nodesMap.set(entryData.uid, {
        ...entryData,
        type: "resource",
      } as ResourceNode);
    } else {
      nodesMap.set(entryData.uid, {
        ...entryData,
        type: "folder",
        children: [],
      } as FolderNode);
    }
  });

  // Establish parent-child relationships
  data.g?.edges.forEach((edge) => {
    const sourceNode = nodesMap.get(edge.source.uid);
    const targetNode = nodesMap.get(edge.target.uid);

    if (sourceNode && targetNode && sourceNode.type === "folder") {
      sourceNode.children.push(targetNode);
    }
  });

  // Identify root nodes (nodes that are not targets of any edge)
  const targetUids = new Set(data.g?.edges.map((edge) => edge.target.uid));
  nodesMap.forEach((node) => {
    if (!targetUids.has(node.uid) && node.type === "folder") {
      rootNodes.push(node);
    }
  });

  return rootNodes;
}
