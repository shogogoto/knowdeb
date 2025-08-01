import { useDetailKnowdeSentenceSentenceIdGet } from "~/generated/knowde/knowde";
import KnowdeCard from "../components/KnowdeCard";

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

  return (
    <>
      <div>{id}</div>
      {Object.values(data.data.knowdes).map((v, i) => {
        return <KnowdeCard key={v.uid} row={v} index={i} />;
      })}
    </>
  );
}
