import { File, Folder } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import type { TreeDataItem } from "~/shared/components/tree-view";
import { Button } from "~/shared/components/ui/button";
import { Breadcrumb } from "./Breadcrumb";
import DeleteButton from "./DeleteButton";
import type { ExplorerTreeDataItem } from "./types";

type TileViewProps = {
  items: (TreeDataItem & ExplorerTreeDataItem)[];
  mutate: () => void;
};

export function TileView({ items, mutate }: TileViewProps) {
  const [currentPath, setCurrentPath] = useState<ExplorerTreeDataItem[]>([]);
  const navigate = useNavigate();

  if (currentPath.length === 0 && items.length > 0) {
    setCurrentPath([{ id: "root", name: "Home", children: items }]);
  }

  const currentFolder = currentPath[currentPath.length - 1];
  const currentItems = currentFolder?.children || [];

  function handleItemClick(item: ExplorerTreeDataItem) {
    if (item.children) {
      setCurrentPath([...currentPath, item]);
    } else {
      navigate(`/resource/${item.id}`);
    }
  }

  function handlePathChange(newPath: ExplorerTreeDataItem[]) {
    setCurrentPath(newPath);
  }

  return (
    <div className="space-y-2">
      <Breadcrumb path={currentPath} onPathChange={handlePathChange} />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {currentItems.map((item) => (
          <div key={item.id} className="relative">
            <Button
              variant="outline"
              onClick={() => handleItemClick(item)}
              className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg border p-4 text-center transition-colors hover:bg-accent"
            >
              {item.children ? (
                <Folder className="h-12 w-12 text-blue-500" />
              ) : (
                <File className="h-12 w-12 text-gray-500" />
              )}
              <TileDetail item={item} />
            </Button>
            <div className="absolute right-1 top-1">
              <DeleteButton
                entryId={item.id}
                name={item.name}
                refresh={mutate}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TileDetail({ item }: { item: TreeDataItem & ExplorerTreeDataItem }) {
  return (
    <>
      <span className="w-full truncate text-sm">{item.name}</span>
      <div className="mt-1 text-xs text-gray-500">
        {item.authors && item.authors.length > 0 && (
          <span>{item.authors.join(", ")}</span>
        )}
        {item.published && <p className="ml-1">{item.published}</p>}
        {item.content_size !== undefined && (
          <p className="ml-1">{item.content_size.n_sentence} words</p>
        )}
      </div>
    </>
  );
}
