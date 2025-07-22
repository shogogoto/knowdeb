import { useState } from "react";
import SidebarLayout from "../SidebarLayout";
import BottomNavigation from "../components/BottomNavigation";
import GuestSidebar from "./GuestSidebar";
import "github-markdown-css/github-markdown.css";

export default function GuestLayout() {
  const isDocMode = useState(false);

  return (
    <SidebarLayout
      sidebar={<GuestSidebar />}
      className={isDocMode ? "markdown-body p-4 list-md" : ""}
      bottomNavigation={<BottomNavigation />}
    />
  );
}
