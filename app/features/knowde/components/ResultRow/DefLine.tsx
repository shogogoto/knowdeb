import { Link } from "react-router";
import type { KnowdeWithStats } from "~/generated/fastAPI.schemas";

type Props = {
  kn: KnowdeWithStats;
};

export default function DefLine({ kn }: Props) {
  const k = kn.knowde;
  return (
    <div className="break-all">
      <Link to={`/knowde/${k.uid}`} className="hover:underline">
        {k.term?.names && (
          <span className="font-semibold text-green-700 dark:text-green-600">
            {k.term.names.join(", ")}:&nbsp;
          </span>
        )}
        {k.sentence}
      </Link>
    </div>
  );
}
