import type { Route } from "./+types/detail";

export async function clientLoader({ params }: Route.LoaderArgs) {
  return { id: params.id };
}

export default function ResourceDetail({ loaderData }: Route.ComponentProps) {
  const { id } = loaderData;
  return <div>{id}</div>;
}
