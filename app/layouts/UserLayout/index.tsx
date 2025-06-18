import SidebarLayout from "../SidebarLayout";
import BottomNavigation from "../components/BottomNavigation";
import UserSidebar from "./UserSidebar";

export default function Userlayout() {
  return (
    <SidebarLayout
      sidebar={<UserSidebar />}
      bottomNavigation={<BottomNavigation />}
    />
  );
}
