import { ArrowUpCircle, ChevronRight } from "lucide-react";
import React, { useState } from "react";
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
import type { KnowdeDetail } from "~/shared/generated/fastAPI.schemas";
import { cn } from "~/shared/lib/utils";
import { KnowdeCardContent, createStatView } from "../components/KnowdeCard";
import LocationView from "../components/LocationView";
import DetailNested from "./KnowdeGroup";
import KnowdeGroup2 from "./KnowdeGroup/KnowdeGroup2";
import Parents from "./KnowdeGroup/Parents";
import { graphForView } from "./util";
import { eqEdgeType, operatorGraph, succ } from "./util/network";

type Props = {
  detail: KnowdeDetail;
};

const colors = {
  detail: {
    in: "border-blue-800",
    out: "border-blue-400",
    tab: "data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900",
    bgIn: "bg-blue-50 dark:bg-blue-950",
    bgOut: "bg-blue-100 dark:bg-blue-800",
  },
  logic: {
    in: "border-green-800",
    out: "border-green-400",
    tab: "data-[state=active]:bg-green-100 dark:data-[state=active]:bg-green-900",
    bgIn: "bg-green-50 dark:bg-green-950",
    bgOut: "bg-green-100 dark:bg-green-900",
  },
  ref: {
    in: "border-orange-800",
    out: "border-yellow-400",
    tab: "data-[state=active]:bg-yellow-100 dark:data-[state=active]:bg-yellow-900",
    bgIn: "bg-yellow-50 dark:bg-yellow-950",
    bgOut: "bg-orange-100 dark:bg-orange-900",
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
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="my-2">
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
      <CollapsibleContent className="pl-4 pt-2">
        {validChildren}
      </CollapsibleContent>
    </Collapsible>
  );
}

export default function MainView({ detail }: Props) {
  const { root, g, kn, location, rootId } = graphForView(detail);

  const belows = succ(g, rootId, eqEdgeType("below"));
  const logicOp = operatorGraph(g, "to");
  const refOp = operatorGraph(g, "resolved");

  const st = createStatView(root.stats);

  const logicPred = logicOp.pred(rootId);
  const logicSucc = logicOp.succ(rootId);
  const refPred = refOp.pred(rootId);
  const refSucc = refOp.succ(rootId);

  return (
    <div className="flex-1 overflow-y-auto max-w-3xl">
      {/* パンくずリスト */}
      <div className="mb-4">
        <LocationView loc={location} />
      </div>
      <Card key={root.uid} className="w-full">
        <KnowdeCardContent k={root} />
      </Card>
      <Tabs defaultValue="detail" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
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
        <TabsContent value="detail">
          <CollapsibleSection
            title="親"
            stat={<ArrowUpCircle className="size-4" />}
            backgroundColor={colors.detail.bgIn}
          >
            <Parents
              parents={location.parents}
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
        <TabsContent value="logic">
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
        <TabsContent value="ref">
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
      </Tabs>
    </div>
  );
}
