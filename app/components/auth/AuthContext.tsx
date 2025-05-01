import { createContext, useContext, useEffect, useState } from "react";
import { authJwtLogoutAuthJwtLogoutPost } from "../../generated/auth/auth";

interface User {
  email: string;
  id: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: User, redirectTo?: string) => void;
  logout: () => Promise<void>;
  saveRedirectUrl: (url: string) => void;
  getRedirectUrl: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "knowde_auth_token";
const USER_DATA_KEY = "knowde_user_data";
const REDIRECT_URL_KEY = "knowde_redirect_url";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem(TOKEN_KEY);
    const userData = localStorage.getItem(USER_DATA_KEY);

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_DATA_KEY);
      }
    }

    setIsLoading(false);
  }, []);

  const login = (token: string, userData: User, redirectTo?: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    setUser(userData);

    if (redirectTo) {
      localStorage.setItem(REDIRECT_URL_KEY, redirectTo);
    }
  };

  const saveRedirectUrl = (url: string) => {
    localStorage.setItem(REDIRECT_URL_KEY, url);
  };

  const getRedirectUrl = () => {
    const url = localStorage.getItem(REDIRECT_URL_KEY);
    if (url) {
      localStorage.removeItem(REDIRECT_URL_KEY);
    }
    return url;
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        await authJwtLogoutAuthJwtLogoutPost({
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_DATA_KEY);
      setUser(null);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    saveRedirectUrl,
    getRedirectUrl,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
