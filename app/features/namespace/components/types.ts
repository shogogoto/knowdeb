import type { TreeDataItem } from "~/shared/components/tree-view";
import type {
  MResourceAuthors,
  MResourcePublished,
  ResourceStats,
} from "~/shared/generated/fastAPI.schemas";

export interface ExplorerTreeDataItem extends TreeDataItem {
  authors?: MResourceAuthors;
  published?: MResourcePublished;
  content_size?: ResourceStats | undefined;
  children?: ExplorerTreeDataItem[];
}
