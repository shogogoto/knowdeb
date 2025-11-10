import { File, Folder, LayoutGrid, List } from "lucide-react";
import { useState } from "react";
import { type TreeDataItem, TreeView } from "~/shared/components/tree-view";
import { Button } from "~/shared/components/ui/button";
import { useGetNamaspaceNamespaceGet } from "~/shared/generated/entry/entry";
import type {
  Entry,
  MResource,
  NameSpace,
} from "~/shared/generated/fastAPI.schemas";
import { Breadcrumb } from "./Breadcrumb";
import { TileView } from "./TileView";

function isResourceNode(node: Entry | MResource): node is MResource {
  return "authors" in node && "published" in node;
}

function transformToTreeData(data: NameSpace): TreeDataItem[] {
  const nodesMap = new Map<string, TreeDataItem>();
  const rootNodes: TreeDataItem[] = [];

  if (!data.g?.nodes) return [];

  // biome-ignore lint/suspicious/noExplicitAny: The actual type from the API seems to be { id: Entry | MResource }
  data.g.nodes.forEach((graphNode: any) => {
    const entryData = graphNode.id;
    if (isResourceNode(entryData)) {
      nodesMap.set(entryData.uid, {
        id: entryData.uid,
        name: entryData.name,
      });
    } else {
      nodesMap.set(entryData.uid, {
        id: entryData.uid,
        name: entryData.name,
        children: [],
      });
    }
  });

  if (!data.g.edges) {
    return Array.from(nodesMap.values());
  }

  const childUids = new Set<string>();

  // biome-ignore lint/suspicious/noExplicitAny: The actual edge type from the API seems to be { source: { uid: string }, target: { uid: string } }
  data.g.edges.forEach((edge: any) => {
    const sourceNode = nodesMap.get(edge.source.uid);
    const targetNode = nodesMap.get(edge.target.uid);

    if (sourceNode && targetNode && sourceNode.children) {
      sourceNode.children.push(targetNode);
      childUids.add(targetNode.id);
    }
  });

  nodesMap.forEach((node) => {
    if (!childUids.has(node.id)) {
      rootNodes.push(node);
    }
  });

  return rootNodes;
}

export default function NamespaceExplorer() {
  const {
    data: fetchedData,
    error,
    isLoading,
  } = useGetNamaspaceNamespaceGet({ fetch: { credentials: "include" } });
  const data = fetchedData?.data;
  const [viewMode, setViewMode] = useState<"list" | "tile">("list");
  const [currentPath, setCurrentPath] = useState<TreeDataItem[]>([]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error fetching data.</div>;
  }
  if (!data) {
    return <div>no entries.</div>;
  }

  const treeData = transformToTreeData(data);

  // Initialize currentPath with the root nodes if it's empty
  if (currentPath.length === 0 && treeData.length > 0) {
    setCurrentPath([{ id: "root", name: "Home", children: treeData }]);
  }

  const currentFolder = currentPath[currentPath.length - 1];
  const currentItems = currentFolder?.children || [];

  function handleItemClick(item: TreeDataItem) {
    if (item.children) {
      setCurrentPath([...currentPath, item]);
    } else {
      // Handle file click (e.g., open file, show details)
      console.log("File clicked:", item.name);
    }
  }

  function handlePathChange(newPath: TreeDataItem[]) {
    setCurrentPath(newPath);
  }

  return (
    <div>
      <input
        type="file"
        id="file-input"
        //webkitdirectory=""
        // directory=""
        accept=".txt, .md, .kn"
        multiple
      />

      <div className="mb-2 flex justify-end">
        <Button
          onClick={() => setViewMode("list")}
          variant={viewMode === "list" ? "secondary" : "ghost"}
          size="icon"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => setViewMode("tile")}
          variant={viewMode === "tile" ? "secondary" : "ghost"}
          size="icon"
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
      </div>

      {viewMode === "list" ? (
        <TreeView
          data={treeData}
          defaultNodeIcon={Folder}
          defaultLeafIcon={File}
          expandAll
          className="h-full"
        />
      ) : (
        <div className="space-y-2">
          <Breadcrumb path={currentPath} onPathChange={handlePathChange} />
          <TileView items={currentItems} onItemClick={handleItemClick} />
        </div>
      )}
    </div>
  );
}
