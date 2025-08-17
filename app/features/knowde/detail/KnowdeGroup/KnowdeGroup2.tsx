import type { Knowde } from "~/shared/generated/fastAPI.schemas";
import { cn } from "~/shared/lib/utils";
import KnowdeCard from "../../components/KnowdeCard";

type Props = {
  startId: string;
  kn: (id: string) => Knowde;
  getGroup: (id: string) => string[];
  className?: string;
  border?: boolean;
  borderColor?: string;
};

export default function KnowdeGroup2({
  startId,
  kn,
  getGroup,
  className,
  border,
  borderColor,
}: Props) {
  const nexts = getGroup(startId);
  const cName =
    nexts.length > 0 || border
      ? cn("border-l-4", borderColor, className)
      : className;

  return (
    <div className={cName}>
      <KnowdeCard k={kn(startId)} key={startId} />
      {nexts.map((id) => {
        return (
          <KnowdeGroup2
            startId={id}
            kn={kn}
            key={id}
            getGroup={getGroup}
            className="ml-1"
            border
            borderColor={borderColor}
          />
        );
      })}
    </div>
  );
}
