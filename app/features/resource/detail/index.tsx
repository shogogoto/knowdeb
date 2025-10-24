// import type Graph from "graphology";
// import type { Attributes } from "graphology-types";
// import { Separator } from "~/shared/components/ui/separator";
import { toGraph } from "~/shared/lib/network";
import Backbone from "./Backbone";
import { ResourceDetailProvider } from "./Context";
import Presenter from "./Presenter";
import { TraceMemoryProvider } from "./TraceMemory/Context";
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

type Props = {
  id: string;
};

export default function ResourceDetail({ id }: Props) {
  const { g, resource_info, uids, terms } = resourceDetailFiture;
  const { user, resource, resource_stats } = resource_info;
  const graph = toGraph(g);
  return (
    <ResourceDetailProvider
      graph={graph}
      terms={terms}
      uids={uids}
      rootId={resource.uid}
    >
      <TraceMemoryProvider>
        <div className="markdown-body p-4">
          <Presenter id={resource.uid} />
          <Backbone startId={resource.uid} key={id} />
        </div>
      </TraceMemoryProvider>
    </ResourceDetailProvider>
  );
}
