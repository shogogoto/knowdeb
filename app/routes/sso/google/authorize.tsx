import Loading from "~/features/auth/AuthGuard/Loading";
import { authorize } from "~/features/auth/sso/google";

export const clientLoader = authorize;
export default function _() {
  return <Loading />;
}
