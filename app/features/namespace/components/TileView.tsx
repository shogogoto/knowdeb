import { File, Folder } from "lucide-react";
import type { TreeDataItem } from "~/shared/components/tree-view";

type TileViewProps = {
  items: TreeDataItem[];
  onItemClick: (item: TreeDataItem) => void;
};

export function TileView({ items, onItemClick }: TileViewProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {items.map((item) => (
        <button
          type="button"
          key={item.id}
          onClick={() => onItemClick(item)}
          className="flex flex-col items-center justify-center gap-2 rounded-lg border p-4 text-center transition-colors hover:bg-accent"
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
              {item.published && <span className="ml-1">{item.published}</span>}
              {item.content_size !== undefined && (
                <span className="ml-1">
                  {item.content_size.n_sentence} words
                </span>
              )}
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
