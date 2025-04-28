import type { Knowde } from "~/generated/fastAPI.schemas";

type Props = {
  kn: Knowde;
};

export default function DefLine({ kn }: Props) {
  return (
    <div className="break-words">
      {kn.term?.names && (
        <span className="font-semibold text-green-700 dark:text-green-600 contents">
          {kn.term.names.join(", ")}:&nbsp;
        </span>
      )}
      {kn.sentence}
      {/* <span className="font-medium mb-2">{kn.sentence}</span> */}
    </div>
  );
}
