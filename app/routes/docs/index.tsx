import { Link } from "react-router";

export default function Docs() {
  return (
    <>
      <h1>ドキュメント一覧</h1>
      <ol>
        <li>
          <Link to="/">ランディングページ</Link>
        </li>
        <li>
          <Link to="/docs/concept">コンセプト</Link>
        </li>
        <li>
          <Link to="/docs/get-started">始めてみよう</Link>
        </li>
        <li>
          <Link to="/docs/features">機能一覧</Link>
        </li>
      </ol>
    </>
  );
}
