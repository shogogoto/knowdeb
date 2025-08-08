import type { UserReadPublic } from "~/generated/fastAPI.schemas";

export type UserProps = {
  user: UserReadPublic | undefined;
};
