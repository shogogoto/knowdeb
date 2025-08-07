import type React from "react";
import { useEffect } from "react";
import { useAuth } from "../AuthProvider";
import AuthGuardLoading from "./Loading";
import Unauth from "./Unauth";

export default function AuthGuard({ children }: React.PropsWithChildren) {
  const { isAuthenticated, isLoading, isValidating, mutate } = useAuth();
  useEffect(() => {
    if (isAuthenticated) return;
    mutate();
  }, [mutate, isAuthenticated]);

  if (isAuthenticated) {
    return <>{children}</>;
  }
  if (isLoading || isValidating) {
    return <AuthGuardLoading />;
  }
  return <Unauth />;
}
