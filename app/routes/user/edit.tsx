import AuthGuard from "~/features/auth/AuthGuard";
import UserProfileForm from "~/features/user/UserProfileForm";
import { editUserProfile } from "~/features/user/UserProfileForm/action";

// cookieはserver actionでは使えない
// server actionのがセキュアらしいが、cookieの中継が必要
// そのやり方がよく分からないので一旦 clientAction
export const clientAction = editUserProfile;
export default function _() {
  return (
    <AuthGuard>
      <UserProfileForm />
    </AuthGuard>
  );
}
