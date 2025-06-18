import { Link } from "react-router";

export const documents = [
  {
    title: "ランディングページ",
    to: "/",
  },
  {
    title: "目次",
    to: "/docs/toc",
  },
  {
    title: "コンセプト",
    to: "/docs/concept",
  },

  {
    title: "始めよう",
    to: "/docs/get-started",
  },
  {
    title: "CLI",
    to: "/docs/cli",
  },

  {
    title: "機能一覧",
    to: "/docs/features",
  },
];

export default function Docs() {
  return (
    <>
      <h1>ドキュメント一覧</h1>
      <ol>
        {documents.map((doc) => (
          <li key={doc.title}>
            <Link to={doc.to}>{doc.title}</Link>
          </li>
        ))}
      </ol>
    </>
  );
}
