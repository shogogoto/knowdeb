import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
import type { KeyedMutator } from "swr";
import { authCookieLogoutAuthCookieLogoutPost } from "~/generated/auth/auth";
import type { UserRead } from "~/generated/fastAPI.schemas"; // Adjust path
import {
  useUsersCurrentUserUserMeGet,
  type usersCurrentUserUserMeGetResponse,
} from "~/generated/user/user";

interface AuthContextT {
  user: UserRead | null;
  isLoading: boolean;
  isValidating: boolean;
  signOut: () => Promise<void>;
  isAuthenticated: boolean | undefined;
  mutate: KeyedMutator<usersCurrentUserUserMeGetResponse>;
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
  const { data, isLoading, isValidating, mutate } =
    useUsersCurrentUserUserMeGet({
      fetch: { credentials: "include" },
      swr: {
        // revalidateOnReconnect: true,
        // revalidateOnMount: true,
        errorRetryCount: 3,
      },
    });

  const isAuthenticated = data?.status === 200;
  useEffect(() => {
    if (data?.data === null) {
      setUser(null);
    } else {
      setUser(data?.data || null);
    }
  }, [data]);

  const signOut = useCallback(async () => {
    try {
      await authCookieLogoutAuthCookieLogoutPost({ credentials: "include" });
      await mutate();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      toast.success("ロクアウトしました");
    }
  }, [mutate]);
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isValidating,
        signOut,
        isAuthenticated,
        mutate,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
