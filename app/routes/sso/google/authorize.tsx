import AuthGuardBody from "~/features/auth/AuthGuard/Body";
import { authorize } from "~/features/auth/sso/google";

export const clientLoader = authorize;
export default function Callback() {
  return <AuthGuardBody />;
}
