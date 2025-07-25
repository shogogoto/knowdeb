import type React from "react";
import { useAuth } from "../AuthProvider";
import AuthGuardLoading from "./Loading";
import Unauth from "./Unauth";

export default function AuthGuard({ children }: React.PropsWithChildren) {
  const { isAuthenticated, isLoading, user, mutate } = useAuth();

  mutate();
  console.log({ isAuthenticated, isLoading, user });
  if (isLoading || isAuthenticated === undefined) {
    return <AuthGuardLoading />;
  }
  if (!isAuthenticated) {
    return <Unauth />;
  }

  return <>{children}</>;
}
