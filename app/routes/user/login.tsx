import SignInForm, { UserSignInAction } from "~/features/auth/SingIn";

export const clientAction = UserSignInAction;
export default function SignIn() {
  return <SignInForm />;
}
