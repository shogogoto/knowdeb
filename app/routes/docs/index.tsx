import { Link } from "react-router";

export default function Docs() {
  return (
    <>
      <h1>ドキュメント一覧</h1>
      <ol>
        <li>
          <Link to="get-started">はしめに</Link>
        </li>
      </ol>
    </>
  );
}
