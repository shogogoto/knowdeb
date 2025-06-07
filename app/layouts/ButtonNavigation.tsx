// モバイル向けに常時表示される下部ボタン群

import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/react-router";
import { BookOpen, Crown, Home, PanelLeftIcon, Search } from "lucide-react";
import { Link } from "react-router";
import { useSidebar } from "~/components/ui/sidebar";

export default function ButtonNavigation() {
  const { toggleSidebar } = useSidebar();
  const size = 24;

  return (
    <nav className="sm:hidden fixed flex bottom-0 left-0 right-0 px-4 py-1 border-t justify-between bg-white dark:bg-gray-950">
      <PanelLeftIcon size={size} onClick={toggleSidebar} />
      <Link to="/home">
        <Home size={size} />
      </Link>
      <Link to="/search">
        <Search size={size} />
      </Link>
      <div>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
      <Link to="/ranking">
        <Crown size={size} />
      </Link>
      <Link to="/docs">
        <BookOpen size={size} />
      </Link>
    </nav>
  );
}
