import KnowdeSearch from "~/features/knowde/search/index";
import { searchKnowde } from "~/features/knowde/search/server";

export function meta() {
  return [
    { title: "Search Knowde" },
    { name: "description", content: "Search knowledge database" },
  ];
}

export const loader = searchKnowde;

export default KnowdeSearch;

export function HydrateFallback() {
  return (
    <div id="loading-splash">
      <div id="loading-splash-spinner" />
      <p>読み込み中、しばらくお待ちください...</p>
    </div>
  );
}
