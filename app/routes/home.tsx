import { Link } from "react-router";
// import type { Route } from "./+types/home";

// export function meta({}: Route.MetaArgs) {
export function meta() {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <Link
      to="search"
      className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
    >
      知識検索ページへ
    </Link>
  );
}
