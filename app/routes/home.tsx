import { Link } from "react-router";
// import type { Route } from "./+types/home";

// export function meta({}: Route.MetaArgs) {
export function meta() {
  return [
    { title: "Knowde" },
    {
      name: "description",
      content: "Welcome to Knowde - Your Knowledge Search Platform",
    },
  ];
}

export default function Home() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 text-center">
      <Link
        to="search"
        className="p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        知識検索ページへ
      </Link>
    </div>
  );
}
