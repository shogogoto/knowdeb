import { Link } from "react-router";
import type { MResource } from "~/generated/fastAPI.schemas";

type Props = {
  resource: MResource;
};

export default function ResourcePath({ resource }: Props) {
  return (
    <div className="text-sm text-muted-foreground space-x-2">
      <Link to={`/resource/${resource.uid}`} className="hover:underline">
        {resource.name}
      </Link>
      <span>{resource?.authors}</span>
      <span>{resource?.published}</span>
    </div>
  );
}
