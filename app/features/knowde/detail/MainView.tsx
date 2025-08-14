import { Card } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import type { KnowdeDetail } from "~/generated/fastAPI.schemas";
import { KnowdeCardContent, createStatView } from "../components/KnowdeCard";
import LocationView from "../components/LocationView";
import KnowdeGroup from "./KnowdeGroup";
import KnowdeGroup2 from "./KnowdeGroup/KnowdeGroup2";
import { graphForView } from "./util";
import { eqEdgeType, operatorGraph, succ } from "./util/network";

type Props = {
  detail: KnowdeDetail;
};

export default function MainView({ detail }: Props) {
  const { root, g, kn, location, rootId } = graphForView(detail);

  const belows = succ(g, rootId, eqEdgeType("below"));

  const logicOp = operatorGraph(g, "to");
  const refOp = operatorGraph(g, "resolved");

  const st = createStatView(root.stats);

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      {/* パンくずリスト */}
      <div className="mb-4">
        <LocationView loc={location} />
      </div>
      <Card key={root.uid} className="w-full max-w-3xl">
        <KnowdeCardContent k={root} />
      </Card>
      <Tabs defaultValue="detail" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="detail">
            詳細
            {st.detail}
          </TabsTrigger>
          <TabsTrigger value="logic">
            論理
            {st.premise}
            {st.conclusion}
          </TabsTrigger>
          <TabsTrigger value="ref">
            参照
            {st.refer}
            {st.referred}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="detail">
          {/* <ParentKnowdes parents={location.parents} /> */}
          Make changes to your account here.
          {belows?.map((bid) => {
            return <KnowdeGroup startId={bid} kn={kn} g={g} key={bid} />;
          })}
        </TabsContent>
        <TabsContent value="logic">
          {logicOp.pred(rootId).map((id) => (
            <KnowdeGroup2
              startId={id}
              kn={kn}
              getGroup={logicOp.pred}
              key={id}
            />
          ))}
          {logicOp.succ(rootId).map((id) => (
            <KnowdeGroup2
              startId={id}
              kn={kn}
              getGroup={logicOp.succ}
              key={id}
            />
          ))}
        </TabsContent>
        <TabsContent value="ref">
          {refOp.pred(rootId).map((id) => (
            <KnowdeGroup2 startId={id} kn={kn} getGroup={refOp.pred} key={id} />
          ))}
          {refOp.succ(rootId).map((id) => (
            <KnowdeGroup2 startId={id} kn={kn} getGroup={refOp.succ} key={id} />
          ))}
        </TabsContent>
      </Tabs>

      {/* {excepted.map((v, i) => { */}
      {/*   return <KnowdeCard key={v} k={knowdes[v]} index={i} />; */}
      {/* })} */}
    </div>
  );
}
