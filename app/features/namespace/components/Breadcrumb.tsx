import { Folder } from "lucide-react";
import type { TreeDataItem } from "~/shared/components/tree-view";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Breadcrumb as BreadcrumbUi,
} from "~/shared/components/ui/breadcrumb";

type BreadcrumbProps = {
  path: TreeDataItem[];
  onPathChange: (newPath: TreeDataItem[]) => void;
};

export function Breadcrumb({ path, onPathChange }: BreadcrumbProps) {
  function handlePathClick(index: number) {
    onPathChange(path.slice(0, index + 1));
  }

  return (
    <BreadcrumbUi>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <button
              type="button"
              onClick={() => onPathChange(path.slice(0, 1))}
              className="flex items-center gap-1"
            >
              <Folder className="h-4 w-4" />
              <span>Root</span>
            </button>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {path.slice(1).map((item, index) => (
          <div key={item.id} className="flex items-center">
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {index === path.slice(1).length - 1 ? (
                <BreadcrumbPage>{item.name}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <button
                    type="button"
                    onClick={() => handlePathClick(index + 1)}
                  >
                    {item.name}
                  </button>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </BreadcrumbUi>
  );
}
