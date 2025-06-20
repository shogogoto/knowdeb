import { usersCurrentUserUserMeGet } from "~/generated/user/user";

export default async function Me() {
  const me = await usersCurrentUserUserMeGet();

  console.log(me);
}
