import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/react-router";
import { Link } from "react-router";
import favicon from "/favicon.ico";
import { ThemeToggle } from "../theme";

export function Header() {
  return (
    <header className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 shadow-md z-10">
      <div className="mx-auto px-4 py-3 flex items-center justify-between border">
        <div className="flex items-center">
          <Link
            to="/"
            className="text-2xl font-bold text-blue-600 dark:text-blue-400"
          >
            <img src={favicon} alt="Logo" className="inline" />
          </Link>
          <nav className="ml-6">
            <ul className="flex space-x-4">
              <li>
                <Link
                  to="/search"
                  className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  Search
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
