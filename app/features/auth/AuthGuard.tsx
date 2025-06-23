import type React from "react";
import { Outlet } from "react-router";
import { useAuth } from "./AuthProvider";

interface AuthGuardProps {
  children?: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const isAuthenticated = !!user;
  if (isLoading) {
    return <div>Loading authentication...</div>;
  }

  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }

  return children ? <>{children}</> : <Outlet />;
};

export default AuthGuard;
