import KnowdeDetailView from "~/features/knowde/detail";
import type { Route } from "./+types";

export async function clientLoader({ params }: Route.LoaderArgs) {
  return { id: params.id };
}

export default function _({ loaderData }: Route.ComponentProps) {
  const { id } = loaderData;
  return <KnowdeDetailView id={id} />;
}
