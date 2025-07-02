import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router";
import {
  authCookieLoginAuthCookieLoginPost,
  authCookieLogoutAuthCookieLogoutPost,
} from "~/generated/auth/auth";
import type { UserRead } from "~/generated/fastAPI.schemas"; // Adjust path
import { useUsersCurrentUserUserMeGet } from "~/generated/user/user";

interface AuthContextT {
  user: UserRead | null;
  isLoading: boolean;
  isValidating: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthorized: boolean;
  mutate: () => void;
  setUser: React.Dispatch<React.SetStateAction<UserRead | null>>;
}

export const AuthContext = createContext<AuthContextT | undefined>(undefined);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<UserRead | null>(null);
  const navigate = useNavigate();
  const { data, isLoading, isValidating, mutate } =
    useUsersCurrentUserUserMeGet({
      fetch: { credentials: "include" },
    });
  const isAuthorized = data?.status === 200;
  useEffect(() => {
    if (data?.data === null) {
      setUser(null);
    } else {
      setUser(data?.data || null);
    }
  }, [data]);

  useEffect(() => {
    mutate();
  }, [mutate]); // 最初に一回ロード

  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        const res = await authCookieLoginAuthCookieLoginPost(
          { username: email, password },
          { credentials: "include" },
        );
        await mutate();
        if (res.status === 204) {
          await mutate();
          navigate("/home");
        } else {
          console.error("signIn: Login failed with status", res.status);
        }
      } catch (error) {
        console.error("signIn: Login failed:", error);
      }
    },
    [mutate, navigate],
  ); // 依存配列に mutate と navigate を含

  const signOut = useCallback(async () => {
    try {
      await authCookieLogoutAuthCookieLogoutPost({ credentials: "include" });
      await mutate();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
    }
  }, [mutate]);
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isValidating,
        signIn,
        signOut,
        isAuthorized,
        mutate,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
