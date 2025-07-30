import { useDetailKnowdeSentenceSentenceIdGet } from "~/generated/knowde/knowde";
import ResultRow from "../components/ResultRow";

type Props = {
  id: string;
};

export default function KnowdeDetailView({ id }: Props) {
  const { data, isLoading, error } = useDetailKnowdeSentenceSentenceIdGet(id);

  // const [detail, setDetail] = useState<KnowdeDetail | undefined>(undefined);
  // useEffect(() => {
  //   if (data?.data && "knowdes" in data.data) {
  //     setDetail(data.data);
  //   }
  // }, [data]);

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
        return <ResultRow key={v.knowde.uid} row={v} index={i} />;
      })}
    </>
  );
}
