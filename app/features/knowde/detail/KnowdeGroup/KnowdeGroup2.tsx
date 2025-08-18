import type { Knowde } from "~/shared/generated/fastAPI.schemas";
import KnowdeCard from "../../components/KnowdeCard";

type Props = {
  startId: string;
  kn: (id: string) => Knowde;
  getGroup: (id: string) => string[];
  className?: string;
  borderColor?: string;
};

export default function KnowdeGroup2({
  startId,
  kn,
  getGroup,
  className,
  borderColor,
}: Props) {
  const nexts = getGroup(startId);

  return (
    <div className={className}>
      <KnowdeCard k={kn(startId)} key={startId} borderColor={borderColor} />
      {nexts.map((id) => {
        return (
          <KnowdeGroup2
            startId={id}
            kn={kn}
            key={id}
            getGroup={getGroup}
            className="ml-1"
            borderColor={borderColor}
          />
        );
      })}
    </div>
  );
}
