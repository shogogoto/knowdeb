import type { Knowde } from "~/shared/generated/fastAPI.schemas";
import { cn } from "~/shared/lib/utils";
import KnowdeCard from "../../components/KnowdeCard";

type Props = {
  parents: Knowde[];
  className?: string;
};

export default function Parents({ parents, className }: Props) {
  const nexts = parents.slice(0, -1);
  const up = parents[parents.length - 1];
  if (up === undefined) {
    return null;
  }
  return (
    <div className={cn("border border-red-500", className)}>
      <KnowdeCard k={up} />
      <Parents parents={nexts} className="ml-1" />
    </div>
  );
}
