"use client";
import { Suspense } from "react";
import { useLocation } from "react-router";
import Loading from "~/shared/components/Loading";
import type {
  Knowde,
  KnowdeDetail,
  MResource,
  UserReadPublic,
} from "~/shared/generated/fastAPI.schemas";
import {
  type detailKnowdeSentenceSentenceIdGetResponse200,
  useDetailKnowdeSentenceSentenceIdGet,
} from "~/shared/generated/knowde/knowde";
import { useCachedSWR } from "~/shared/hooks/swr/useCache";
import { knowdeDetailCache } from "~/shared/lib/indexed";
import { CacheInfo } from "../components/CacheInfo";
import MainView from "./MainView";

type Props = {
  id: string;
};

type PrefetchedState = {
  knowde: Knowde;
  user: UserReadPublic;
  resource: MResource;
};

export function _KnowdeDetailView({ id }: Props) {
  const location = useLocation();
  const prefetched = location.state as PrefetchedState | undefined;
  const validPrefetched =
    prefetched?.knowde.uid === id ? prefetched : undefined;

  const fallbackData = useCachedSWR<
    KnowdeDetail,
    detailKnowdeSentenceSentenceIdGetResponse200 & { headers: Headers }
  >(id, knowdeDetailCache.get);

  const { data, isLoading } = useDetailKnowdeSentenceSentenceIdGet(
    id,
    undefined,
    {
      swr: {
        revalidateOnFocus: false,
        keepPreviousData: false,
        fallbackData,
        // suspense: true, // suspenseは使わずisLoadingで制御
        onSuccess: async (data) => {
          if (data.status === 200) {
            await knowdeDetailCache.set(data.data);
          }
        },
      },
    },
  );

  const fullDetail = data?.status === 200 ? data.data : fallbackData?.data;

  if (isLoading && !fullDetail) {
    if (validPrefetched) {
      return (
        <div className="flex flex-col md:flex-row h-screen">
          <div className="flex-1 overflow-y-auto">
            <MainView prefetched={validPrefetched} />
          </div>
          <CacheInfo />
        </div>
      );
    }
    return <Loading type="center-x" />;
  }

  if (fullDetail) {
    return (
      <div className="flex flex-col md:flex-row h-screen">
        <div className="flex-1 overflow-y-auto">
          <MainView detail={fullDetail} />
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

  // TODO: エラーハンドリング
  return <div>{JSON.stringify(data)}</div>;
}

export default function KnowdeDetailView({ id }: Props) {
  return (
    <Suspense fallback={<Loading type="center-x" />}>
      <_KnowdeDetailView id={id} />
    </Suspense>
  );
}
