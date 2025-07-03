import { File, Folder } from "lucide-react";
import { useGetNamaspaceNamespaceGet } from "~/generated/entry/entry";
import type { NameSpace } from "~/generated/fastAPI.schemas";
import {
  type NamespaceNode,
  buildNamespaceTree,
} from "../libs/namespace-utils";

interface NamespaceExplorerProps {
  data?: NameSpace; // Make data optional for Storybook
}

function EntryItem({ node, level }: { node: NamespaceNode; level: number }) {
  const indent = level * 20;

  return (
    <div style={{ paddingLeft: `${indent}px` }} className="flex items-center">
      {node.type === "folder" ? (
        <Folder className="w-4 h-4 mr-2" />
      ) : (
        <File className="w-4 h-4 mr-2" />
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
  return (
    <div>
      {nodes.map((node) => (
        <div key={node.uid}>
          <EntryItem node={node} level={level} />
          {node.type === "folder" && node.children.length > 0 && (
            <NamespaceEntries nodes={node.children} level={level + 1} />
          )}
        </div>
      ))}
    </div>
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
  console.log(error);
  if (!data) {
    return <div>no entries.</div>;
  }

  const namespaceTree = buildNamespaceTree(data);
  return <NamespaceEntries nodes={namespaceTree} level={0} />;
}
