import { File, Folder, Trash2 } from "lucide-react";
import type { TreeDataItem } from "~/shared/components/tree-view";
import { Button } from "~/shared/components/ui/button";

type TileViewProps = {
  items: TreeDataItem[];
  onItemClick: (item: TreeDataItem) => void;
  onDeleteClick: (item: TreeDataItem) => void;
};

export function TileView({ items, onItemClick, onDeleteClick }: TileViewProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {items.map((item) => (
        <div key={item.id} className="relative">
          <button
            type="button"
            onClick={() => onItemClick(item)}
            className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg border p-4 text-center transition-colors hover:bg-accent"
          >
            {item.children ? (
              <Folder className="h-12 w-12 text-blue-500" />
            ) : (
              <File className="h-12 w-12 text-gray-500" />
            )}
            <span className="w-full truncate text-sm">{item.name}</span>
            {(item.authors || item.published || item.content_size) && (
              <div className="mt-1 text-xs text-gray-500">
                {item.authors && item.authors.length > 0 && (
                  <span>{item.authors.join(", ")}</span>
                )}
                {item.published && (
                  <span className="ml-1">{item.published}</span>
                )}
                {item.content_size !== undefined && (
                  <span className="ml-1">
                    {item.content_size.n_sentence} words
                  </span>
                )}
              </div>
            )}
          </button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteClick(item);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
