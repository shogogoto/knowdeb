import type { UserReadPublic } from "~/shared/generated/fastAPI.schemas";

export type UserProps = {
  user: UserReadPublic | undefined;
};
