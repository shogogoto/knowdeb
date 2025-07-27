import AuthGuard from "~/features/auth/AuthGuard";
import GoogleCallback, { receiveCookie } from "~/features/auth/sso/google";

export const clientLoader = receiveCookie;
export default () => (
  <AuthGuard>
    <GoogleCallback />
  </AuthGuard>
);
