"use client";
import { LoaderCircle } from "lucide-react";
import { Suspense, lazy } from "react";
import type { KnowdeDetail } from "~/generated/fastAPI.schemas";
import {
  type detailKnowdeSentenceSentenceIdGetResponse,
  useDetailKnowdeSentenceSentenceIdGet,
} from "~/generated/knowde/knowde";
import { useCachedSWR } from "~/hooks/swr/useCache";
import { knowdeDetailCache } from "~/lib/indexed";
import { CacheInfo } from "../components/CacheInfo";
import MainView from "./MainView";

const DisplayGraph = lazy(() => import("./util/ui"));

type Props = {
  id: string;
};

export function _KnowdeDetailView({ id }: Props) {
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
    return <div>{JSON.stringify(data)}</div>;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="flex-1 overflow-y-auto">
        <MainView detail={data.data} />
      </div>

      {/* <div className="w-1/4 bg-gray-100 p-4 border-l hidden md:block overflow-y-auto"> */}
      {/* <Suspense fallback={<div>Loading Graph...</div>}> */}
      {/*   <DisplayGraph detail={data.data} /> */}
      {/* </Suspense> */}
      {/* <SideView /> */}
      {/* </div> */}
      <CacheInfo />
    </div>
  );
}

export default function KnowdeDetailView({ id }: Props) {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-4">
          <LoaderCircle className="animate-spin" />
        </div>
      }
    >
      <_KnowdeDetailView id={id} />
    </Suspense>
  );
}
