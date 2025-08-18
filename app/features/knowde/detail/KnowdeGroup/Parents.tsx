import type { Knowde } from "~/shared/generated/fastAPI.schemas";
import KnowdeCard from "../../components/KnowdeCard";

type Props = {
  parents: Knowde[];
  className?: string;
  borderColor?: string;
};

export default function Parents({ parents, className, borderColor }: Props) {
  const nexts = parents.slice(0, -1);
  const up = parents[parents.length - 1];
  if (up === undefined) {
    return null;
  }
  return (
    <div className={className}>
      <KnowdeCard k={up} borderColor={borderColor} />
      <Parents parents={nexts} className="ml-1" borderColor={borderColor} />
    </div>
  );
}
