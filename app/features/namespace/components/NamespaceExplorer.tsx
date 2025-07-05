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
  if (!data) {
    return <div>no entries.</div>;
  }

  const namespaceTree = buildNamespaceTree(data);
  return <NamespaceEntries nodes={namespaceTree} level={0} />;
}
