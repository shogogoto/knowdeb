import AuthGuard from "~/features/auth/AuthGuard";
import UserProfileForm from "~/features/user/UserProfileForm";
import { editUserProfile } from "~/features/user/UserProfileForm/action";

export const clientAction = editUserProfile;
export default function _() {
  return (
    <AuthGuard>
      <UserProfileForm />
    </AuthGuard>
  );
}
