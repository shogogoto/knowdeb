import SignUpForm, { UserRegisterAction } from "~/features/auth/SignUp";

export default function Register() {
  return <SignUpForm />;
}

export const action = UserRegisterAction;
