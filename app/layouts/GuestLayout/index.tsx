import { useAuth } from "~/features/auth/AuthProvider";
import SidebarLayout from "../SidebarLayout";
import BottomNavigation from "../components/BottomNavigation";
import GuestSidebar from "./GuestSidebar";
import "github-markdown-css/github-markdown.css";
import { useMatch } from "react-router";

export default function GuestLayout() {
  const isDocMode = useMatch("/docs/*");

  const { isAuthorized } = useAuth();

  console.log({ isAuthorized });

  return (
    <SidebarLayout
      sidebar={<GuestSidebar />}
      className={isDocMode ? "markdown-body p-4 list-md" : ""}
      bottomNavigation={<BottomNavigation />}
    />
  );
}
