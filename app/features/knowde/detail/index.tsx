"use client";
import { LoaderCircle } from "lucide-react";
import { Suspense, lazy } from "react";
import { Card } from "~/components/ui/card";
import type { KnowdeDetail } from "~/generated/fastAPI.schemas";
import {
  type detailKnowdeSentenceSentenceIdGetResponse,
  useDetailKnowdeSentenceSentenceIdGet,
} from "~/generated/knowde/knowde";
import { useCachedSWR } from "~/hooks/swr/useCache";
import { knowdeDetailCache } from "~/lib/indexed";
import KnowdeCard, {
  KnowdeCardContent,
  KnowdeCardFooter,
} from "../components/KnowdeCard";
import LocationView from "../components/LocationView";
import KnowdeGroup from "./KnowdeGroup";

const DisplayGraph = lazy(() => import("./util/ui"));

type Props = {
  id: string;
};

export default function KnowdeDetailView({ id }: Props) {
  const fallbackData = useCachedSWR<
    KnowdeDetail,
    detailKnowdeSentenceSentenceIdGetResponse
  >(id, knowdeDetailCache.get);

  const { data } = useDetailKnowdeSentenceSentenceIdGet(id, undefined, {
    swr: {
      keepPreviousData: true,
      fallbackData,
      suspense: true,
      onSuccess: async (data) => {
        if (data.status === 200) {
          await knowdeDetailCache.set(data.data);
        }
      },
    },
  });

  if (data?.status !== 200) {
    return <div>Error fetching data. </div>;
  }

  const { uid, location, knowdes } = data.data;
  const excepted = Object.keys(knowdes).filter((v) => v !== uid);
  const k = knowdes[uid.replaceAll(/-/g, "")];
  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-4">
          <LoaderCircle className="animate-spin" />
        </div>
      }
    >
      {/* <CacheInfo /> */}
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
      <Suspense fallback={<div>Loading Graph...</div>}>
        <DisplayGraph detail={data.data} />
      </Suspense>
    </Suspense>
  );
}
