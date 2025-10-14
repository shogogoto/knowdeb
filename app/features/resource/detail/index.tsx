// import type Graph from "graphology";
// import type { Attributes } from "graphology-types";
// import { Separator } from "~/shared/components/ui/separator";
import { eqEdgeType, succ, toGraph } from "~/shared/lib/network";
import ResourceWireframe from "./ResourceDetailNested";
import { resourceDetailFiture } from "./fixture";

//
// function ContentTree({
//   graph,
//   uids,
//   rootNodeId,
// }: {
//   graph: Graph;
//   uids: typeof resourceDetailFiture.uids;
//   rootNodeId: string;
// }) {
//   const renderNode = (nodeId: string, level: number) => {
//     const nodeLabel = uids[nodeId as keyof typeof uids];
//     const children = graph.outNeighbors(nodeId);
//
//     // const label = typeof nodeLabel === "string" ? nodeLabel : nodeLabel?.n;
//     // if (typeof label !== "string") return null;
//     //
//     // const isHeading = label.startsWith("#");
//     // const HeadingTag = `h${Math.min(
//     //   level + 1,
//     //   6,
//     // )}` as keyof JSX.IntrinsicElements;
//     //
//     // return (
//     //   <div key={nodeId} style={{ marginLeft: `${level * 20}px` }}>
//     //     {isHeading ? (
//     //       {/* <HeadingTag className="font-bold mt-4 mb-2"> */}
//     //       {/*   {label.replace(/#/g, "").trim()} */}
//     //       {/* </HeadingTag> */}
//     //     ) : (
//     //       <p>{label}</p>
//     //     )}
//     //     {children.map((childId) => renderNode(childId, level + 1))}
//     //   </div>
//     // );
//   };
//
//   const rootChildren = graph.outNeighbors(rootNodeId);
//
//   return (
//     <div className="mt-4">
//       {rootChildren.map((childId) => renderNode(childId, 1))}
//     </div>
//   );
// }
//

type Props = { id: string };
export default function ResourceDetail({ id }: Props) {
  const { g, resource_info, uids } = resourceDetailFiture;
  const { user, resource, resource_stats } = resource_info;
  const graph = toGraph(g);

  const root = resource.uid;

  return (
    <div>
      <h1>{resource_info.resource.name}</h1>
      {succ(graph, root, eqEdgeType("below")).map((id) => {
        return (
          <ResourceWireframe
            startId={id}
            toLine={(id: string) => uids[id].toString()}
            g={graph}
            key={id}
          />
        );
      })}
    </div>
  );
  // // headエッジを持つノードを探すことで、文章の開始点を見つける
  // const rootNodeId = graph.findNode((_node, attr: Attributes) => {
  //   // resource自身がrootになる
  //   return attr.uid === resource.uid;
  // });
  //
  // if (!rootNodeId) {
  //   // 基本的にfixtureなのでありえない
  //   return <div>root node not found</div>;
  // }
  //
  // return (
  //   <div className="p-4">
  //     {/* <ResourceHeader resource={resource} user={user} stats={resource_stats} /> */}
  //     <Separator className="my-4" />
  //     <ContentTree graph={graph} uids={uids} rootNodeId={rootNodeId} />
  //   </div>
  // );
}
