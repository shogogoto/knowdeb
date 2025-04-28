import type { Knowde } from "~/generated/fastAPI.schemas";
import DefLine from "./DefLine";

type Props = {
  caption: string;
  arr?: Knowde[];
};

export default function DetailList({ caption, arr }: Props) {
  if (!arr || arr.length === 0) {
    return <></>;
  }
  return (
    <details open className="pl-2 border">
      <summary>{`${caption}(${arr.length})`}</summary>
      <ol>
        {arr.map((el) => (
          <li key={el.uid} className="pl-4 mt-1">
            <DefLine kn={el} />
          </li>
        ))}
      </ol>
    </details>
  );
}
