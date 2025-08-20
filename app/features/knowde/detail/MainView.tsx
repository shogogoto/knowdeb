import { ArrowUpCircle, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { useSearchParams } from "react-router";
import Loading from "~/shared/components/Loading";
import { Card } from "~/shared/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/shared/components/ui/collapsible";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/shared/components/ui/tabs";
import type {
  Knowde,
  KnowdeDetail,
  KnowdeLocation,
  MResource,
  UserReadPublic,
} from "~/shared/generated/fastAPI.schemas";
import { cn } from "~/shared/lib/utils";
import { KnowdeCardContent, createStatView } from "../components/KnowdeCard";
import LocationView from "../components/LocationView";
import { DetailContextProvider } from "./DetailContext";
import DetailNested from "./KnowdeGroup";
import KnowdeGroup2 from "./KnowdeGroup/KnowdeGroup2";
import Parents from "./KnowdeGroup/Parents";
import { TabProvider } from "./TabContext";
import { graphForView } from "./util";
import { eqEdgeType, operatorGraph, succ } from "./util/network";

type PrefetchedState = {
  knowde: Knowde;
  user: UserReadPublic;
  resource: MResource;
};

const colors = {
  detail: {
    in: "border-blue-800",
    out: "border-blue-400",
    tab: "data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900",
    bgIn: "bg-blue-100 dark:bg-blue-950",
    bgOut: "bg-blue-50 dark:bg-blue-800",
  },
  logic: {
    in: "border-green-800",
    out: "border-green-400",
    tab: "data-[state=active]:bg-green-100 dark:data-[state=active]:bg-green-900",
    bgIn: "bg-green-100 dark:bg-green-950",
    bgOut: "bg-green-50 dark:bg-green-900",
  },
  ref: {
    in: "border-orange-800",
    out: "border-yellow-400",
    tab: "data-[state=active]:bg-yellow-100 dark:data-[state=active]:bg-yellow-900",
    bgIn: "bg-orange-100 dark:bg-orange-950",
    bgOut: "bg-yellow-50 dark:bg-orange-900",
  },
};

function CollapsibleSection({
  title,
  stat,
  backgroundColor,
  children,
}: {
  title: string;
  stat?: React.ReactNode;
  backgroundColor?: string;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const validChildren = React.Children.toArray(children).filter(Boolean);
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger
        className={cn(
          "flex items-center gap-1 w-full p-2 rounded-md hover:bg-muted",
          backgroundColor,
        )}
      >
        <ChevronRight
          className={cn(
            "transition-transform duration-200",
            isOpen && "rotate-90",
          )}
        />
        <div className="flex items-center gap-2 font-bold">
          {stat}
          <h3>{title}</h3>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>{validChildren}</CollapsibleContent>
    </Collapsible>
  );
}
type Props = {
  detail?: KnowdeDetail;
  prefetched?: PrefetchedState;
};

export default function MainView({ detail, prefetched }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();

  const headerKnowde = detail ? graphForView(detail).root : prefetched?.knowde;
  const headerLocation: Partial<KnowdeLocation> | undefined = detail
    ? graphForView(detail).location
    : { user: prefetched?.user, resource: prefetched?.resource };

  if (!headerKnowde) {
    // 親コンポーネントのロジック的にここには来ないはず
    return <Loading type="center-x" />;
  }

  // detailがあるときだけgraph関連の処理を行う
  const { g, kn, rootId, belows, logicOp, refOp, st } = detail
    ? (() => {
        const { root, g, kn, location, rootId } = graphForView(detail);
        const belows = succ(g, rootId, eqEdgeType("below"));
        const logicOp = operatorGraph(g, "to");
        const refOp = operatorGraph(g, "resolved");
        const st = createStatView(root.stats, true);
        return { g, kn, rootId, belows, logicOp, refOp, st };
      })()
    : {
        g: null,
        kn: null,
        rootId: null,
        belows: [],
        logicOp: null,
        refOp: null,
        st: createStatView(headerKnowde.stats, true),
      };

  const logicPred = detail && rootId && logicOp ? logicOp.pred(rootId) : [];
  const logicSucc = detail && rootId && logicOp ? logicOp.succ(rootId) : [];
  const refPred = detail && rootId && refOp ? refOp.pred(rootId) : [];
  const refSucc = detail && rootId && refOp ? refOp.succ(rootId) : [];

  const validTabs = ["detail", "logic", "ref"];
  const currentTab = searchParams.get("tab");
  const tabValue =
    currentTab && validTabs.includes(currentTab) ? currentTab : "detail";

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  return (
    <DetailContextProvider
      value={
        headerLocation.user && headerLocation.resource
          ? { user: headerLocation.user, resource: headerLocation.resource }
          : null
      }
    >
      <TabProvider value={searchParams}>
        <div className="flex-1 max-w-3xl mx-auto">
          {headerLocation.user && headerLocation.resource && (
            <div className="m-1">
              <LocationView loc={headerLocation as KnowdeLocation} />
            </div>
          )}
          <Tabs
            value={tabValue}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <div className="sticky top-0 z-5 bg-background">
              <Card
                key={headerKnowde.uid}
                className="w-full rounded-none border-x-0"
              >
                <KnowdeCardContent k={headerKnowde} />
              </Card>
              <TabsList className="grid w-full grid-cols-3 rounded-none">
                <TabsTrigger value="detail" className={colors.detail.tab}>
                  詳細
                  {st.detail}
                </TabsTrigger>
                <TabsTrigger value="logic" className={colors.logic.tab}>
                  {st.premise}
                  論理
                  {st.conclusion}
                </TabsTrigger>
                <TabsTrigger value="ref" className={colors.ref.tab}>
                  {st.refer}
                  参照
                  {st.referred}
                </TabsTrigger>
              </TabsList>
            </div>

            {detail && g && rootId && logicOp && refOp ? (
              <>
                <TabsContent value="detail" className="mt-[-0.5rem]">
                  <CollapsibleSection
                    title="親"
                    stat={<ArrowUpCircle className="size-4" />}
                    backgroundColor={colors.detail.bgIn}
                  >
                    <Parents
                      parents={graphForView(detail).location.parents}
                      borderColor={colors.detail.in}
                    />
                  </CollapsibleSection>
                  <CollapsibleSection
                    title="子"
                    stat={st.detail}
                    backgroundColor={colors.detail.bgOut}
                  >
                    {belows?.map((bid) => (
                      <DetailNested
                        startId={bid}
                        kn={kn}
                        g={g}
                        key={bid}
                        borderColor={colors.detail.out}
                      />
                    ))}
                  </CollapsibleSection>
                </TabsContent>
                <TabsContent value="logic" className="mt-[-0.5rem]">
                  <CollapsibleSection
                    title="前提"
                    stat={st.premise}
                    backgroundColor={colors.logic.bgIn}
                  >
                    {logicPred.map((id) => (
                      <KnowdeGroup2
                        startId={id}
                        kn={kn}
                        getGroup={logicOp.pred}
                        key={id}
                        borderColor={colors.logic.in}
                      />
                    ))}
                  </CollapsibleSection>
                  <CollapsibleSection
                    title="結論"
                    stat={st.conclusion}
                    backgroundColor={colors.logic.bgOut}
                  >
                    {logicSucc.map((id) => (
                      <KnowdeGroup2
                        startId={id}
                        kn={kn}
                        getGroup={logicOp.succ}
                        key={id}
                        borderColor={colors.logic.out}
                      />
                    ))}
                  </CollapsibleSection>
                </TabsContent>
                <TabsContent value="ref" className="mt-[-0.5rem]">
                  <CollapsibleSection
                    title="参照"
                    stat={st.refer}
                    backgroundColor={colors.ref.bgIn}
                  >
                    {refSucc.map((id) => (
                      <KnowdeGroup2
                        startId={id}
                        kn={kn}
                        getGroup={refOp.succ}
                        key={id}
                        borderColor={colors.ref.in}
                      />
                    ))}
                  </CollapsibleSection>
                  <CollapsibleSection
                    title="被参照"
                    stat={st.referred}
                    backgroundColor={colors.ref.bgOut}
                  >
                    {refPred.map((id) => (
                      <KnowdeGroup2
                        startId={id}
                        kn={kn}
                        getGroup={refOp.pred}
                        key={id}
                        borderColor={colors.ref.out}
                      />
                    ))}
                  </CollapsibleSection>
                </TabsContent>
              </>
            ) : (
              <div className="p-4">
                <Loading type="center-x" />
              </div>
            )}
          </Tabs>
        </div>
      </TabProvider>
    </DetailContextProvider>
  );
}
