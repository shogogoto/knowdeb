import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/react-router";
import { Files, Home, Search } from "lucide-react";
import { Link } from "react-router";
import favicon from "/favicon.ico";
import { ThemeToggle } from "../theme";
import { Separator } from "../ui/separator";

export function SiteLogo() {
  return (
    <Link to="/" className="text-blue-600 dark:text-blue-400">
      <img src={favicon} alt="Logo" className="inline" />
    </Link>
  );
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
    <header className="p-2 flex justify-between border">
      <div className="flex items-center">
        <nav className="flex">
          <ul className="flex space-x-2 items-center">
            {children}
            <SiteLogo />
          </ul>
        </nav>
      </div>

      {/* 右側 */}
      <div className="flex space-x-2">
        <nav className="flex items-center">
          <ul className="flex space-x-2">
            {items.map((item) => (
              <HeaderItem key={item.title}>
                <Link to={item.to}>
                  <item.icon />
                </Link>
              </HeaderItem>
            ))}
          </ul>
          <Separator orientation="vertical" className="mr-2" />
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
        </nav>
      </div>
    </header>
  );
}
