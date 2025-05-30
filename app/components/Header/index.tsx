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

export function SiteLogo() {
  return (
    <Link to="/" className="text-blue-600 dark:text-blue-400">
      <img src={favicon} alt="Logo" className="inline" />
    </Link>
  );
}

type HeaderLinkProps = {
  to: string;
  children: React.ReactNode;
};

export function HeaderItem({ to, children }: HeaderLinkProps) {
  return (
    <li>
      <Link
        to={to}
        className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
      >
        {children}
      </Link>
    </li>
  );
}

export function Header({ children }: React.PropsWithChildren) {
  return (
    <header className="p-2 flex justify-between border">
      <div className="flex items-center">
        <nav className="flex">
          <ul className="flex space-x-2 items-center">
            {children}
            <SiteLogo />
            <HeaderItem to="/home">
              <Home />
            </HeaderItem>
            <HeaderItem to="/search">
              <Search />
            </HeaderItem>
            <HeaderItem to="/search">
              <Files />
            </HeaderItem>
          </ul>
        </nav>
      </div>

      <div className="flex space-x-2">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <ThemeToggle />
      </div>
    </header>
  );
}
