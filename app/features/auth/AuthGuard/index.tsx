import type React from "react";
import { useAuth } from "../AuthProvider";

export default function AuthGuard({ children }: React.PropsWithChildren) {
  const { user, isLoading } = useAuth();

  // if (!user) {
  //   return <AuthGuardBody />;
  // }

  return <>{children}</>;
}
