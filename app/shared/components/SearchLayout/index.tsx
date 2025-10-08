import type React from "react";
import { useContext } from "react";
import PagingNavi from "../Pagenation";
import PageContext from "../Pagenation/PageContext";

type Props = {
  header: React.ReactNode;
  main: React.ReactNode;
};

export default function SearchLayout({ header, main }: Props) {
  const { total } = useContext(PageContext);
  return (
    <div className="flex flex-col h-dvh relative">
      <header className="flex sticky z-5 top-0 border-b">{header}</header>
      <main className="flex-1 h-dvh overflow-y-auto justify-center w-full">
        {main}
      </main>
      <footer className="flex sticky bottom-0 bg-background border-t">
        <PagingNavi total={total} />
      </footer>
    </div>
  );
}
