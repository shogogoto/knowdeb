import "@react-sigma/core/lib/style.css";
import "@react-sigma/graph-search/lib/style.css";
import {
  ControlsContainer,
  FullScreenControl,
  SigmaContainer,
  ZoomControl,
} from "@react-sigma/core";
import {
  LayoutForceAtlas2Control,
  useWorkerLayoutForceAtlas2,
} from "@react-sigma/layout-forceatlas2";
import { MiniMap } from "@react-sigma/minimap";
import { useEffect } from "react";
import { ClientOnly } from "~/components/ClientOnly";
import type { KnowdeDetail } from "~/generated/fastAPI.schemas";
import { toDisplayGraph } from "..";

export const Fa2 = () => {
  const { start, kill } = useWorkerLayoutForceAtlas2({
    settings: { slowDown: 10 },
  });
  useEffect(() => {
    start();
    return () => kill();
  }, [start, kill]);
  return null;
};

type Props = {
  detail: KnowdeDetail;
};

function DisplayGraphComponent({ detail }: Props) {
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
        <LayoutForceAtlas2Control />
      </ControlsContainer>
      <ControlsContainer position={"bottom-left"}>
        <MiniMap width="100px" height="100px" />
      </ControlsContainer>
    </SigmaContainer>
  );
}

export default function DisplayGraph(props: Props) {
  return <ClientOnly>{() => <DisplayGraphComponent {...props} />}</ClientOnly>;
}
