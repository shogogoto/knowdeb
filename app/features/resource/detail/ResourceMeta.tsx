import { Calendar, User } from "lucide-react";
import type { ResourceInfo } from "~/shared/generated/fastAPI.schemas";

type Props = {
  info: ResourceInfo;
};

export default function ResourceMeta({ info }: Props) {
  const { resource } = info;
  const authors = resource.authors?.join(", ");
  const publishedDate = resource.published
    ? new Date(resource.published).toLocaleDateString("ja-JP")
    : null;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
      {authors && (
        <div className="flex items-center gap-1.5">
          <User className="size-4" />
          <span>{authors}</span>
        </div>
      )}
      {publishedDate && (
        <div className="flex items-center gap-1.5">
          <Calendar className="size-4" />
          <span>{publishedDate}</span>
        </div>
      )}
      {/* <span>{resource_info.resource_stats}</span> */}
    </div>
  );
}
