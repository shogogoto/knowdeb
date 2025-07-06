import { File, Folder } from "lucide-react";
import { useGetNamaspaceNamespaceGet } from "~/generated/entry/entry";
import type { Entry, MResource, NameSpace } from "~/generated/fastAPI.schemas";

type FolderNode = Entry & {
  type: "folder";
  children: NamespaceNode[];
};

type ResourceNode = MResource & {
  type: "resource";
};

type NamespaceNode = FolderNode | ResourceNode;

function isResourceNode(node: Entry | MResource): node is MResource {
  return "authors" in node && "published" in node;
}

function buildNamespaceTree(data: NameSpace): NamespaceNode[] {
  const nodesMap = new Map<string, NamespaceNode>();
  const rootNodes: NamespaceNode[] = [];

  if (!data.g?.nodes) {
    return [];
  }

  // 1. Create a map of all nodes
  // biome-ignore lint/suspicious/noExplicitAny: The actual type from the API seems to be { id: Entry | MResource }
  data.g.nodes.forEach((graphNode: any) => {
    const entryData = graphNode.id;
    if (isResourceNode(entryData)) {
      nodesMap.set(entryData.uid, {
        ...entryData,
        type: "resource",
      });
    } else {
      nodesMap.set(entryData.uid, {
        ...entryData,
        type: "folder",
        children: [],
      });
    }
  });

  if (!data.g.edges) {
    return Array.from(nodesMap.values());
  }

  // 2. Build the tree structure
  // biome-ignore lint/suspicious/noExplicitAny: The actual edge type from the API seems to be { source: { uid: string }, target: { uid: string } }
  data.g.edges.forEach((edge: any) => {
    // The type definition from orval might be incorrect. Accessing .uid based on the old working code.
    const sourceNode = nodesMap.get(edge.source.uid);
    const targetNode = nodesMap.get(edge.target.uid);

    if (
      sourceNode &&
      targetNode &&
      "type" in sourceNode &&
      sourceNode.type === "folder"
    ) {
      sourceNode.children.push(targetNode);
    }
  });

  // 3. Determine root nodes (any node that is not a child of another node)
  // biome-ignore lint/suspicious/noExplicitAny: See above
  const childUids = new Set(data.g.edges.map((edge: any) => edge.target.uid));
  nodesMap.forEach((node) => {
    if (!childUids.has(node.uid)) {
      rootNodes.push(node);
    }
  });

  return rootNodes;
}

function EntryItem({ node }: { node: NamespaceNode }) {
  return (
    <div className="flex items-center p-1 rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer">
      {node.type === "folder" ? (
        <Folder className="w-4 h-4 mr-2 text-yellow-600 fill-yellow-400 dark:text-yellow-500 dark:fill-yellow-300" />
      ) : (
        <File className="w-4 h-4 mr-2 text-gray-600 fill-gray-300 dark:text-gray-400 dark:fill-gray-600" />
      )}
      <span>{node.name}</span>
      {node.type === "resource" && node.authors && node.authors.length > 0 && (
        <span className="ml-2 text-sm text-muted-foreground">
          ({node.authors.join(", ")})
        </span>
      )}
      {node.type === "resource" && node.published && (
        <span className="ml-2 text-sm text-muted-foreground">
          ({node.published})
        </span>
      )}
    </div>
  );
}

function NamespaceEntries({
  nodes,
  level,
}: {
  nodes: NamespaceNode[];
  level: number;
}) {
  const listClasses = level === 0 ? "space-y-1" : "pl-5 space-y-1 mt-1";

  return (
    <ul className={listClasses}>
      {nodes.map((node) => (
        <li key={node.uid}>
          <EntryItem node={node} />
          {node.type === "folder" && node.children.length > 0 && (
            <NamespaceEntries nodes={node.children} level={level + 1} />
          )}
        </li>
      ))}
    </ul>
  );
}

export default function NamespaceExplorer() {
  const {
    data: fetchedData,
    error,
    isLoading,
  } = useGetNamaspaceNamespaceGet({ fetch: { credentials: "include" } });
  const data = fetchedData?.data;

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error fetching data.</div>;
  }
  if (!data) {
    return <div>no entries.</div>;
  }

  const namespaceTree = buildNamespaceTree(data);
  return <NamespaceEntries nodes={namespaceTree} level={0} />;
}
