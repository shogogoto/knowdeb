import DefLine from "~/features/knowde/components/ResultRow/DefLine";
import { detailKnowdeSentenceSentenceIdGet } from "~/generated/knowde/knowde";
import type { Route } from "./+types";

export async function loader({ params }: Route.LoaderArgs) {
  const res = await detailKnowdeSentenceSentenceIdGet(params.id);
  if (res.status !== 200) {
    throw new Error("error");
  }
  return { data: res.data, id: params.id };
}

export default function Contact({ loaderData }: Route.ComponentProps) {
  const { id, data } = loaderData;
  data.knowdes;
  return (
    <div id="contact">
      <div>{id}</div>
      {Object.values(data.knowdes).map((v) => {
        return <DefLine key={v.uid} kn={v} />;
      })}
    </div>
  );
}
