import { File, Folder, Link2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import Loading from "~/shared/components/Loading";
import { TreeView } from "~/shared/components/tree-view";
import { Button } from "~/shared/components/ui/button";
import { useGetNamaspaceNamespaceGet } from "~/shared/generated/entry/entry";
import type {
  Entry,
  MResource,
  NameSpace,
} from "~/shared/generated/fastAPI.schemas";
import DeleteButton from "./DeleteButton";
import { TileView } from "./TileView";
import ViewSwitcher from "./ViewSwitcher";
import type { ExplorerTreeDataItem } from "./types";

function isResourceNode(node: Entry | MResource): node is MResource {
  return "authors" in node && "published" in node;
}

function transformToTreeData(
  data: NameSpace,
  mutate: () => void,
  navigate: (path: string) => void,
): ExplorerTreeDataItem[] {
  const nodesMap = new Map<string, ExplorerTreeDataItem>();
  const rootNodes: ExplorerTreeDataItem[] = [];

  if (!data.g?.nodes) return [];

  // biome-ignore lint/suspicious/noExplicitAny: The actual type from the API seems to be { id: Entry | MResource }
  data.g.nodes.forEach((graphNode: any) => {
    const entryData = graphNode.id;
    const commonData = {
      id: entryData.uid,
      name: entryData.name,
      actions: (
        <>
          <Button variant="ghost" asChild>
            <Link to={`/resource/${entryData.uid}`}>
              <Link2 />
            </Link>
          </Button>
          <DeleteButton
            entryId={entryData.uid}
            name={entryData.name}
            refresh={mutate}
          />
        </>
      ),
    };

    if (isResourceNode(entryData)) {
      nodesMap.set(entryData.uid, {
        ...commonData,
        authors: entryData.authors,
        published: entryData.published,
        content_size: data.stats?.[entryData.uid],
      });
    } else {
      nodesMap.set(entryData.uid, {
        ...commonData,
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
    mutate,
  } = useGetNamaspaceNamespaceGet({ fetch: { credentials: "include" } });
  const data = fetchedData?.data;
  const [viewMode, setViewMode] = useState<"list" | "tile">("list");
  const navigate = useNavigate();

  if (isLoading) return <Loading type="center-x" />;
  if (error) return <div>Error fetching data.</div>;
  if (!data) return <div>no entries.</div>;

  const treeData = transformToTreeData(data, mutate, navigate);
  function renderTreeContent(item: ExplorerTreeDataItem) {
    return (
      <div onKeyUp={item.onClick} key={item.id}>
        <span className="text-sm truncate">{item.name}</span>
        <div className="ml-2 flex-shrink-0 text-xs text-gray-500">
          {item.authors && item.authors.length > 0 && (
            <span>{item.authors.join(", ")}</span>
          )}
          {item.published && <span className="ml-2">{item.published}</span>}
          {item.content_size !== undefined && (
            <span className="ml-2">
              {data?.stats?.[item.id.replaceAll("-", "")].n_sentence} words
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-2 flex justify-end">
        <ViewSwitcher mode={viewMode} setMode={setViewMode} />
      </div>
      {viewMode === "list" ? (
        <TreeView
          data={treeData}
          defaultNodeIcon={Folder}
          defaultLeafIcon={File}
          expandAll
          className="h-full"
          renderContent={renderTreeContent}
        />
      ) : (
        <TileView items={treeData} mutate={mutate} />
      )}
    </div>
  );
}
