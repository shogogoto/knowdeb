import { Link } from "react-router";
import type { Knowde } from "~/generated/fastAPI.schemas";

type Props = {
  kn: Knowde;
};

export default function DefLine({ kn }: Props) {
  return (
    <div className="break-all">
      <Link to={`/knowde/${kn.uid}`} className="hover:underline">
        {kn.term?.names && (
          <span className="font-semibold text-green-700 dark:text-green-600">
            {kn.term.names.join(", ")}:&nbsp;
          </span>
        )}
        {kn.sentence}
      </Link>
    </div>
  );
}
