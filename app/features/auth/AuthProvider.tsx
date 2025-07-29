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
import { getItem, removeItem, setItem } from "~/lib/storage";

interface AuthContextT {
  user: UserRead | null;
  isLoading: boolean;
  isValidating: boolean;
  isCached: boolean;
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

const USER_CACHE_KEY = "auth-user";

export function AuthProvider({ children }: React.PropsWithChildren) {
  const cachedUser = getItem(USER_CACHE_KEY);

  const [user, setUser] = useState<UserRead | null>(() => {
    return cachedUser ? JSON.parse(cachedUser) : null;
  });

  const { data, isLoading, isValidating, mutate } =
    useUsersCurrentUserUserMeGet({
      fetch: { credentials: "include" },
      swr: {
        errorRetryCount: 3,
      },
    });

  const isAuthenticated = data?.status === 200;

  useEffect(() => {
    if (data?.data) {
      setUser(data.data);
      setItem(USER_CACHE_KEY, JSON.stringify(data.data));
    } else if (data?.data === null) {
      setUser(null);
      removeItem(USER_CACHE_KEY);
    }
  }, [data]);

  const signOut = useCallback(async () => {
    try {
      await authCookieLogoutAuthCookieLogoutPost({ credentials: "include" });
      await mutate(); // This will trigger the useEffect above to clear the cache
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      removeItem(USER_CACHE_KEY);
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
        isCached: !!cachedUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
