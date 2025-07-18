import type React from "react";
import { useAuth } from "../AuthProvider";
import AuthGuardLoading from "./Loading";
import Unauth from "./Unauth";

export default function AuthGuard({ children }: React.PropsWithChildren) {
  const { user, isAuthorized, isLoading } = useAuth();

  if (isLoading || user === undefined) {
    return <AuthGuardLoading />;
  }
  if (!isAuthorized) {
    return <Unauth />;
  }

  return <>{children}</>;
}
