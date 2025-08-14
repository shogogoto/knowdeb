import "@react-sigma/core/lib/style.css";
import "@react-sigma/graph-search/lib/style.css";
import {
  ControlsContainer,
  FullScreenControl,
  SigmaContainer,
  ZoomControl,
} from "@react-sigma/core";
import { MiniMap } from "@react-sigma/minimap";
import type { KnowdeDetail } from "~/generated/fastAPI.schemas";
import { toDisplayGraph } from "..";

// export const Fa2 = () => {
//   const { start, kill } = useWorkerLayoutForceAtlas2({
//     settings: { slowDown: 10 },
//   });
//   useEffect(() => {
//     start();
//     return () => kill();
//   }, [start, kill]);
//   return null;
// };

type Props = {
  detail: KnowdeDetail;
};

export default function DisplayGraph({ detail }: Props) {
  const { graph } = toDisplayGraph(detail);

  return (
    <SigmaContainer
      graph={graph}
      //style={{ height: "100vh", width: "100%" }}
      className="border"
      settings={{
        renderEdgeLabels: true,
        defaultEdgeType: "arrow",
        allowInvalidContainer: true,
      }}
    >
      {/* <Fa2 /> */}
      <ControlsContainer
        position={"bottom-right"}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <ZoomControl />
        <FullScreenControl />
        {/* <LayoutForceAtlas2Control /> */}
      </ControlsContainer>
      <ControlsContainer position={"bottom-left"}>
        <MiniMap width="100px" height="100px" />
      </ControlsContainer>
    </SigmaContainer>
  );
}
