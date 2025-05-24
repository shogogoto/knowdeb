import type { Knowde } from "~/generated/fastAPI.schemas";

type Props = {
  knowde: Knowde;
};

export default function RowSuffix({ knowde }: Props) {
  return (
    <>
      <div className="border">{knowde.when}</div>
    </>
  );
}
