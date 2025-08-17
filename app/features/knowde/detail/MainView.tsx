import { Card } from "~/shared/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/shared/components/ui/tabs";
import type { KnowdeDetail } from "~/shared/generated/fastAPI.schemas";
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
    in: "border-blue-800", // 親: 濃い青
    out: "border-blue-400", // 子: 明るい青
    tab: "data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900",
  },
  logic: {
    in: "border-green-800", // 前提: 濃い緑
    out: "border-green-400", // 結論: 明るい緑
    tab: "data-[state=active]:bg-green-100 dark:data-[state=active]:bg-green-900",
  },
  ref: {
    in: "border-orange-800", // 被参照: 濃い橙
    out: "border-yellow-400", // 参照: 明るい黄色
    tab: "data-[state=active]:bg-yellow-100 dark:data-[state=active]:bg-yellow-900",
  },
};

export default function MainView({ detail }: Props) {
  const { root, g, kn, location, rootId } = graphForView(detail);

  const belows = succ(g, rootId, eqEdgeType("below"));

  const logicOp = operatorGraph(g, "to");
  const refOp = operatorGraph(g, "resolved");

  const st = createStatView(root.stats);

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
          <Parents parents={location.parents} borderColor={colors.detail.in} />
          {belows?.map((bid) => {
            return (
              <DetailNested
                startId={bid}
                kn={kn}
                g={g}
                key={bid}
                borderColor={colors.detail.out}
              />
            );
          })}
        </TabsContent>
        <TabsContent value="logic">
          {logicOp.pred(rootId).map((id) => (
            <KnowdeGroup2
              startId={id}
              kn={kn}
              getGroup={logicOp.pred}
              key={id}
              borderColor={colors.logic.in}
            />
          ))}
          {logicOp.succ(rootId).map((id) => (
            <KnowdeGroup2
              startId={id}
              kn={kn}
              getGroup={logicOp.succ}
              key={id}
              borderColor={colors.logic.out}
            />
          ))}
        </TabsContent>
        <TabsContent value="ref">
          {refOp.pred(rootId).map((id) => (
            <KnowdeGroup2
              startId={id}
              kn={kn}
              getGroup={refOp.pred}
              key={id}
              borderColor={colors.ref.in}
            />
          ))}
          {refOp.succ(rootId).map((id) => (
            <KnowdeGroup2
              startId={id}
              kn={kn}
              getGroup={refOp.succ}
              key={id}
              borderColor={colors.ref.out}
            />
          ))}
        </TabsContent>
      </Tabs>

      {/* {excepted.map((v, i) => { */}
      {/*   return <KnowdeCard key={v} k={knowdes[v]} index={i} />; */}
      {/* })} */}
    </div>
  );
}
