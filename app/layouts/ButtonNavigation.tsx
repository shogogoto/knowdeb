// モバイル向けに常時表示される下部ボタン群

import { HomeIcon, MenuIcon, SettingsIcon, UserIcon } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "~/components/ui/drawer";
import { SidebarTrigger } from "~/components/ui/sidebar";

export default function ButtonNavigation() {
  return (
    <nav className="sm:hidden flex bottom-0 left-0 right-0 w-full border-t justify-between">
      <SidebarTrigger />
      <Button variant="ghost">
        <HomeIcon />
      </Button>
      <Button variant="ghost">
        <UserIcon />
      </Button>
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="ghost" className="flex flex-col items-center">
            <MenuIcon />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">メニュー</h3>
            <ul>
              <li>
                <Link
                  to="#"
                  className="flex items-center p-2 rounded-md hover:bg-gray-300"
                >
                  設定
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="flex items-center p-2 rounded-md hover:bg-gray-300"
                >
                  ログアウト
                </Link>
              </li>
              {/* Drawer内のナビゲーション項目 */}
            </ul>
          </div>
        </DrawerContent>
      </Drawer>
      <Button variant="ghost">
        {/* <Button variant="ghost" className="flex flex-col items-center gap-1"> */}
        <SettingsIcon />
      </Button>
    </nav>
  );
}
