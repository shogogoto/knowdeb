import { File, Folder, Trash2 } from "lucide-react";
import { useState } from "react";
import type { TreeDataItem } from "~/shared/components/tree-view";
import { Button } from "~/shared/components/ui/button";
import { Breadcrumb } from "./Breadcrumb";
import type { ExplorerTreeDataItem } from "./types";

type TileViewProps = {
  items: (TreeDataItem & ExplorerTreeDataItem)[];
};

export function TileView({ items }: TileViewProps) {
  const [currentPath, setCurrentPath] = useState<ExplorerTreeDataItem[]>([]);
  if (currentPath.length === 0 && items.length > 0) {
    setCurrentPath([{ id: "root", name: "Home", children: items }]);
  }

  const currentFolder = currentPath[currentPath.length - 1];
  const currentItems = currentFolder?.children || [];

  function handleItemClick(item: ExplorerTreeDataItem) {
    if (item.children) {
      setCurrentPath([...currentPath, item]);
    } else {
      // Handle file click (e.g., open file, show details)
      console.log("File clicked:", item.name);
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
            <button
              type="button"
              onClick={() => handleItemClick(item)}
              className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg border p-4 text-center transition-colors hover:bg-accent"
            >
              {item.children ? (
                <Folder className="h-12 w-12 text-blue-500" />
              ) : (
                <File className="h-12 w-12 text-gray-500" />
              )}
              <span className="w-full truncate text-sm">{item.name}</span>
              <TileDetail item={item} />
            </button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1"
              onClick={(e) => {
                e.stopPropagation();
                //onDeleteClick(item);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function TileDetail({ item }: { item: TreeDataItem & ExplorerTreeDataItem }) {
  console.log(item);
  return (
    <div className="mt-1 text-xs text-gray-500">
      {item.authors && item.authors.length > 0 && (
        <span>{item.authors.join(", ")}</span>
      )}
      {item.published && <p className="ml-1">{item.published}</p>}
      {item.content_size !== undefined && (
        <p className="ml-1">{item.content_size.n_sentence} words</p>
      )}
    </div>
  );
}
