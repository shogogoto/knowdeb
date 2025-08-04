import { Card } from "~/components/ui/card";
import { useDetailKnowdeSentenceSentenceIdGet } from "~/generated/knowde/knowde";
import KnowdeCard, {
  KnowdeCardContent,
  KnowdeCardFooter,
} from "../components/KnowdeCard";
import LocationView from "../components/LocationView";
import KnowdeGroup from "./KnowdeGroup";

type Props = {
  id: string;
};

export default function KnowdeDetailView({ id }: Props) {
  const { data, isLoading, error } = useDetailKnowdeSentenceSentenceIdGet(id);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    console.log({ error });
    return <div>Error fetching data. </div>;
  }
  if (!data?.data) {
    return <div>no entries.</div>;
  }
  if (!("knowdes" in data.data)) {
    if ("detail" in data.data) {
      return <div>Error: {JSON.stringify(data.data.detail)}</div>;
    }
    return <div>Invalid data structure.</div>;
  }

  const { g, uid, location, knowdes } = data.data;
  const excepted = Object.keys(knowdes).filter((v) => v !== uid);

  const k = knowdes[uid];
  return (
    <>
      <LocationView loc={location} />
      <Card key={k.uid} className="w-full max-w-2xl border">
        <KnowdeCardContent k={k} />
        <KnowdeCardFooter k={k} />
      </Card>
      <KnowdeGroup>
        {excepted.map((v, i) => {
          return <KnowdeCard key={v} k={knowdes[v]} index={i} />;
        })}
      </KnowdeGroup>
    </>
  );
}
