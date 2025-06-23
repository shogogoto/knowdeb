import GuestSidebar from "../GuestLayout/GuestSidebar";
import SidebarLayout from "../SidebarLayout";
import BottomNavigation from "../components/BottomNavigation";
import "github-markdown-css/github-markdown.css";

export default function DocumentLayout() {
  return (
    <SidebarLayout
      sidebar={<GuestSidebar />}
      className="markdown-body p-4 list-md"
      bottomNavigation={<BottomNavigation />}
    />
  );
}
