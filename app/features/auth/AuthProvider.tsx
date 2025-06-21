import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { createContext, useContext } from "react";
import {
  useAuthCookieLoginAuthCookieLoginPost,
  useAuthCookieLogoutAuthCookieLogoutPost,
} from "~/generated/auth/auth";
import type { UserRead } from "~/generated/fastAPI.schemas"; // Adjust path
import {
  useUsersCurrentUserUserMeGet,
  usersCurrentUserUserMeGet,
} from "~/generated/user/user";

interface AuthContextType {
  user: UserRead | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<UserRead | null>(null);
  const { trigger: loginTrigger } = useAuthCookieLoginAuthCookieLoginPost({
    fetch: { credentials: "include" },
  });
  useAuthCookieLoginAuthCookieLoginPost;
  const { trigger: logoutTrigger } = useAuthCookieLogoutAuthCookieLogoutPost({
    fetch: { credentials: "include" },
  });

  const { data, isLoading } = useUsersCurrentUserUserMeGet({
    fetch: { credentials: "include" },
  });

  useEffect(() => {
    data?.data && setUser(data.data);
  }, [data]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        await loginTrigger({ username: email, password });
        const res = await usersCurrentUserUserMeGet({ credentials: "include" });
        if (res.status === 200) {
          setUser(res.data);
        }
      } catch (error) {
        console.error("Login failed:", error);
      }
    },
    [loginTrigger],
  );

  const signOut = useCallback(async () => {
    try {
      await logoutTrigger();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
    }
  }, [logoutTrigger]);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
