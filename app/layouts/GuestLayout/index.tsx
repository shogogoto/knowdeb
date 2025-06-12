import SidebarLayout from "../SidebarLayout";
import GuestSidebar from "./GuestSidebar";

export default function GuestLayout() {
  return <SidebarLayout sidebar={<GuestSidebar />} />;
}
