import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/react-router";
import { Files, Home, Search } from "lucide-react";
import favicon from "/favicon.ico";
import { ThemeToggle } from "../theme";

export function SiteLogo() {
  return <img src={favicon} alt="Logo" className="inline" />;
}

export function HeaderItem({ children }: React.PropsWithChildren) {
  return (
    <div className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
      {children}
    </div>
  );
}

export function Header({ children }: React.PropsWithChildren) {
  const items = [
    { title: "Home", to: "/home", icon: Home },
    { title: "Search", to: "/search", icon: Search },
    { title: "Document", to: "/docs", icon: Files },
  ];

  return (
    <header className="p-2 border">
      <ul className="flex w-full space-x-2 items-center justify-between">
        {children}
        <HeaderItem>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </HeaderItem>
        <HeaderItem>
          <ThemeToggle />
        </HeaderItem>
      </ul>
    </header>
  );
}
