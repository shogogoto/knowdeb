// モバイル向けに常時表示される下部ボタン群

import { Crown, Home, Search, SettingsIcon, UserIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { SidebarTrigger } from "~/components/ui/sidebar";

export default function ButtonNavigation() {
  const size = 24 * 3;

  return (
    <nav className="sm:hidden fixed flex bottom-0 left-0 right-0 px-3 py-1 border-t justify-between bg-white dark:bg-gray-950">
      <div className="p-1">
        <SidebarTrigger variant="ghost" />
      </div>
      <Button variant="ghost" asChild>
        <Home size={size} />
      </Button>
      <Button variant="ghost" asChild>
        <Search size={size} />
      </Button>
      <Button variant="ghost" asChild>
        <Crown size={size} />
      </Button>
      <Button variant="ghost" asChild>
        <UserIcon size={size} />
      </Button>
      <Button variant="ghost" asChild>
        <SettingsIcon size={size} />
      </Button>
    </nav>
  );
}
