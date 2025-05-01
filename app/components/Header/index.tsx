import { Link } from "react-router";
import { useAuth } from "../auth";
import { ThemeToggle } from "../theme";

interface HeaderProps {
  isLoggedIn: boolean;
  userEmail?: string;
  onLogout?: () => void;
}

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  return (
    <header className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 shadow-md z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link
            to="/"
            className="text-2xl font-bold text-blue-600 dark:text-blue-400"
          >
            Knowde
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
          {isAuthenticated ? (
            <div className="flex items-center">
              <span className="text-sm text-gray-700 dark:text-gray-300 mr-3">
                {user?.email}
              </span>
              <button
                type="button"
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Login
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
