import type { Knowde } from "~/shared/generated/fastAPI.schemas";
import KnowdeCard from "../../components/KnowdeCard";

type Props = {
  parents: Knowde[];
};

export default function Parents({ parents }: Props) {
  return (
    <>
      {parents.reverse().map((p) => (
        <div key={p.uid}>
          <KnowdeCard k={p} />
        </div>
      ))}
    </>
  );
}
