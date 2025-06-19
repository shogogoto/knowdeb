import SignInForm, { UserSignInAction } from "~/features/auth/SingIn";

export const action = UserSignInAction;
export default function SignIn() {
  return <SignInForm />;
}
