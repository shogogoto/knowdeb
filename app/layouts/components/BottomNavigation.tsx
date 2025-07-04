import { BookOpen, Crown, Home, PanelLeftIcon, Search } from "lucide-react";
import { Link } from "react-router";
import { useSidebar } from "~/components/ui/sidebar";

export default function BottomNavigation() {
  const { toggleSidebar } = useSidebar();
  const size = 24;

  return (
    <nav className="sm:hidden sticky flex bottom-0 left-0 w-full p-4 py-2 border-t justify-between bg-white dark:bg-gray-950">
      <PanelLeftIcon size={size} onClick={toggleSidebar} />
      <Link to="/home">
        <Home size={size} />
      </Link>
      <Link to="/search">
        <Search size={size} />
      </Link>
      <Link to="/ranking">
        <Crown size={size} />
      </Link>
      <Link to="/docs/toc">
        <BookOpen size={size} />
      </Link>
    </nav>
  );
}
