// モバイル向けに常時表示される下部ボタン群

import { Crown, HomeIcon, Search, SettingsIcon, UserIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { SidebarTrigger } from "~/components/ui/sidebar";

export default function ButtonNavigation() {
  return (
    <nav className="sm:hidden flex bottom-0 left-0 right-0 w-full border-t justify-between">
      <div className="p-1">
        <SidebarTrigger variant="ghost" />
      </div>
      <Button variant="ghost">
        <HomeIcon />
      </Button>
      <Button variant="ghost">
        <Search />
      </Button>
      <Button variant="ghost">
        <Crown />
      </Button>
      <Button variant="ghost">
        <UserIcon />
      </Button>
      <Button variant="ghost">
        <SettingsIcon />
      </Button>
    </nav>
  );
}
