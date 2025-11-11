import { File, Folder, Trash2 } from "lucide-react";
import { useState } from "react";
import useSWRMutation from "swr/mutation";
import { TreeView } from "~/shared/components/tree-view";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/shared/components/ui/alert-dialog";
import { Button } from "~/shared/components/ui/button";
import {
  deleteEntryApiEntryEntryIdDelete,
  getDeleteEntryApiEntryEntryIdDeleteMutationKey,
  useGetNamaspaceNamespaceGet,
} from "~/shared/generated/entry/entry";
import type {
  Entry,
  MResource,
  NameSpace,
} from "~/shared/generated/fastAPI.schemas";
import { TileView } from "./TileView";
import ViewSwitcher from "./ViewSwitcher";
import type { ExplorerTreeDataItem } from "./types";

function isResourceNode(node: Entry | MResource): node is MResource {
  return "authors" in node && "published" in node;
}

function transformToTreeData(
  data: NameSpace,
  onDelete: (item: ExplorerTreeDataItem | undefined) => void,
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
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(nodesMap.get(entryData.uid));
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
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
  const [deleteTarget, setDeleteTarget] = useState<ExplorerTreeDataItem | null>(
    null,
  );
  const { trigger: deleteEntry } = useSWRMutation(
    getDeleteEntryApiEntryEntryIdDeleteMutationKey(deleteTarget?.id ?? ""),
    (_, { arg }: { arg: string }) => deleteEntryApiEntryEntryIdDelete(arg),
    {
      onSuccess: () => {
        setDeleteTarget(null);
        mutate(); // Re-fetch the namespace data
      },
    },
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error fetching data.</div>;
  }
  if (!data) {
    return <div>no entries.</div>;
  }

  function handleDeleteRequest(item: ExplorerTreeDataItem | undefined) {
    if (!item) return;
    setDeleteTarget(item);
  }

  function handleConfirmDelete() {
    if (deleteTarget) {
      deleteEntry(deleteTarget.id);
    }
  }

  const treeData = transformToTreeData(data, handleDeleteRequest);

  function renderTreeContent(item: ExplorerTreeDataItem) {
    return (
      <>
        <span className="text-sm truncate">{item.name}</span>
        <div className="ml-2 flex-shrink-0 text-xs text-gray-500">
          {item.authors && item.authors.length > 0 && (
            <span>{item.authors.join(", ")}</span>
          )}
          {item.published && <span className="ml-2">{item.published}</span>}
          {item.content_size !== undefined && (
            <span className="ml-2">{item.content_size.n_sentence} words</span>
          )}
        </div>
      </>
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
        <TileView items={treeData} onDeleteClick={handleDeleteRequest} />
      )}

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={() => setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete "
              {deleteTarget?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
