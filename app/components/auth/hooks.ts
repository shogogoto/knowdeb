import { useAuth } from "./AuthContext";

export const useUser = () => {
  const { user, isLoading, isAuthenticated } = useAuth();
  return { user, isLoading, isAuthenticated };
};

export const useSignIn = () => {
  const { signIn } = useAuth();
  return signIn;
};

export const useSignUp = () => {
  const { signUp } = useAuth();
  return signUp;
};

export const useSignOut = () => {
  const { signOut } = useAuth();
  return signOut;
};
