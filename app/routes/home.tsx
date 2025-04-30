import { Link } from "react-router";
import { useAuth } from "../components/auth";
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
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 text-center">
      <h1 className="text-3xl font-bold mb-6">Welcome to Knowde</h1>

      {isAuthenticated ? (
        <div className="mb-8">
          <p className="text-xl mb-4">
            Hello, {user?.email}! Ready to explore knowledge?
          </p>
        </div>
      ) : (
        <div className="mb-8">
          <p className="text-xl mb-4">
            Your platform for searching and discovering knowledge.
          </p>
          <Link
            to="/login"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 mr-4"
          >
            Login
          </Link>
        </div>
      )}

      <Link
        to="search"
        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        知識検索ページへ
      </Link>
    </div>
  );
}
