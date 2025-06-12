import SidebarLayout from "../SidebarLayout";
import BottomNavigation from "../components/BottomNavigation";
import GuestSidebar from "./GuestSidebar";

export default function GuestLayout() {
  return (
    <SidebarLayout
      sidebar={<GuestSidebar />}
      bottomNavigation={<BottomNavigation />}
    />
  );
}
