import { BookOpen, Crown, Home, PanelLeftIcon, Search } from "lucide-react";
import { Link } from "react-router";
import { useSidebar } from "~/shared/components/ui/sidebar";

export default function BottomNavigation() {
  const { toggleSidebar } = useSidebar();
  const size = 24;

  return (
    <>
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
    </>
  );
}
