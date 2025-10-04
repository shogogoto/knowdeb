import type React from "react";

type Props = {
  header: React.ReactNode;
  main: React.ReactNode;
  footer: React.ReactNode;
};

export default function SearchLayout({ header, main, footer }: Props) {
  return (
    <div className="flex flex-col h-dvh relative">
      <header className="flex sticky z-5 top-0 border-b">{header}</header>
      <main className="flex-1 h-dvh overflow-y-auto justify-center w-full">
        {main}
      </main>
      <footer className="flex sticky bottom-0 bg-background border-t">
        {footer}
      </footer>
    </div>
  );
}
