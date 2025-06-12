import type React from "react";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import {
  useAuthJwtLoginAuthJwtLoginPost,
  useAuthJwtLogoutAuthJwtLogoutPost,
  useRegisterRegisterAuthRegisterPost,
} from "~/generated/auth/auth";
import type { UserRead } from "~/generated/fastAPI.schemas"; // Adjust path
import { useUsersCurrentUserUserMeGet } from "~/generated/user/user";
import { AuthContext } from "./AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

const TOKEN_STORAGE_KEY = "jwt_token";

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem(TOKEN_STORAGE_KEY),
  );
  const [user, setUser] = useState<UserRead | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // SWR Mutations for auth operations
  const { trigger: loginTrigger } = useAuthJwtLoginAuthJwtLoginPost();
  const { trigger: logoutTrigger } = useAuthJwtLogoutAuthJwtLogoutPost();
  const { trigger: registerTrigger } = useRegisterRegisterAuthRegisterPost();

  // SWR hook for fetching current user. We'll disable it initially and enable it when a token exists.
  const {
    data: userData,
    error: userError,
    isLoading: userLoading,
  } = useUsersCurrentUserUserMeGet({
    swr: {
      enabled: !!token, // Only fetch if token exists
      revalidateOnFocus: false, // Don't revalidate on window focus
    },
    fetch: {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    },
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      if (userData?.data) {
        setUser(userData.data);
      } else if (userError) {
        // Token might be invalid or expired, clear it.
        console.error("Failed to fetch user:", userError);
        setToken(null);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      setUser(null);
    }
    setIsLoading(userLoading);
  }, [token, userData, userError, userLoading]);

  const signIn = useCallback(
    async (username: string, password: string) => {
      try {
        const response = await loginTrigger({ username, password });
        if (response.status === 200) {
          setToken(response.data.access_token);
          return true;
        }
        return false;
      } catch (error) {
        console.error("Login failed:", error);
        return false;
      }
    },
    [loginTrigger],
  );

  const signUp = useCallback(
    async (email: string, password: string) => {
      try {
        const response = await registerTrigger({ email, password });
        if (response.status === 201) {
          // After successful registration, you might want to automatically log them in
          // or redirect to a login page. For now, let's just indicate success.
          return true;
        }
        return false;
      } catch (error) {
        console.error("Registration failed:", error);
        return false;
      }
    },
    [registerTrigger],
  );

  const signOut = useCallback(async () => {
    try {
      await logoutTrigger();
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if logout fails on the backend, clear client-side token
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }, [logoutTrigger]);

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
