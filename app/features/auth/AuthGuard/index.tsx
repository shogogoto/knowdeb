import type React from "react";
import { useAuth } from "../AuthProvider";
import AuthGuardBody from "./Body";

export default function AuthGuard({ children }: React.PropsWithChildren) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <AuthGuardBody />;
  }

  return <>{children}</>;
}
