import { useAuth } from "~/features/auth/AuthProvider";
import SidebarLayout from "../SidebarLayout";
import "github-markdown-css/github-markdown.css";
import { useMatch } from "react-router";

export default function GuestLayout() {
  const isDocMode = useMatch("/docs/*");

  const { isAuthenticated } = useAuth();

  return <SidebarLayout />;
}
