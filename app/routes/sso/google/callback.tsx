import GoogleCallback, { receiveCookie } from "~/features/auth/sso/google";

export const clientLoader = receiveCookie;
export default GoogleCallback;
