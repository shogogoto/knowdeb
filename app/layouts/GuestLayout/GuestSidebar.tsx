import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/react-router";
import { ThemeToggle } from "~/components/theme/ThemeToggle";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "~/components/ui/sidebar";
import LogoSideItem from "../components/LogoSideMenu";
import GuestMenu from "./GuestMenu";

export default function GuestSidebar() {
  const { isMobile, toggleSidebar } = useSidebar();
  const handleMenuClick = () => {
    if (isMobile) {
      toggleSidebar();
    }
  };

  const { user } = useUser();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border">
        <SidebarMenu>
          <LogoSideItem />
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className=" flex aspect-square size-8 items-center justify-center rounded-lg">
                <div className="inline ">
                  <SignedOut>
                    <SignInButton />
                  </SignedOut>
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                </div>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.fullName}</span>
                <span className="truncate text-xs">{user?.username}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <GuestMenu />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuButton size="lg" asChild tooltip={"Toggle Theme"}>
          <div className="flex justify-center">
            <ThemeToggle />
          </div>
        </SidebarMenuButton>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
