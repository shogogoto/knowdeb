import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/react-router";
import { MailQuestion } from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { SiteLogo } from "~/components/Header";
import SideMenu from "~/components/Sidemenu";
import { ThemeToggle } from "~/components/theme";
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
import DocMenu from "./DecMenu";

export default function GuestSidebar() {
  const { isMobile, setOpenMobile } = useSidebar();
  const navigate = useNavigate();

  // Close mobile sidebar on navigation
  useEffect(() => {
    // Create navigation event listener
    const handleNavigation = () => {
      if (isMobile) {
        setOpenMobile(false);
      }
    };

    // Add event listener for clicks on links within the sidebar
    const sidebarElement = document.querySelector('[data-sidebar="sidebar"]');
    if (sidebarElement) {
      const links = sidebarElement.querySelectorAll("a");
      links.forEach((link) => {
        link.addEventListener("click", handleNavigation);
      });

      // Cleanup
      return () => {
        links.forEach((link) => {
          link.removeEventListener("click", handleNavigation);
        });
      };
    }
  }, [isMobile, setOpenMobile]);

  // Handle home link click to close sidebar on mobile
  const handleHomeClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip={"Landng Page"}>
              <Link to="/" onClick={handleHomeClick}>
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <SiteLogo />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Knowde</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
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
                <span className="truncate font-medium">User Name</span>
                <span className="truncate text-xs">@user-id</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* <NavUser user={{ name: "test", email: "test", avatar: "test" }} /> */}
      </SidebarHeader>
      <SidebarContent>
        <DocMenu>
          <SideMenu
            icon={<MailQuestion />}
            to={"/contact"}
            title="問い合わせ"
          />
        </DocMenu>
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
