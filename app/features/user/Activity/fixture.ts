import type { UserActivity } from "~/shared/generated/fastAPI.schemas";

export const fixtureActivity: UserActivity = {
  user: {
    display_name: "やっぱつれぇわ",
    profile: "テスト用",
    avatar_url:
      "https://res.cloudinary.com/dgsdrcpcs/image/upload/v1754974207/avatar/25fe8b78-9f8a-4f70-85f3-cfa28a780402.jpg",
    username: "GTO",
    uid: "25fe8b78-9f8a-4f70-85f3-cfa28a780402",
    created: "2025-08-01T14:33:39.471053",
  },
  latest: {
    n_char: 29115,
    n_sentence: 1298,
    n_resource: 6,
    created: "2025-10-31T16:29:06.891282+09:00",
  },
  current: {
    n_char: 29160,
    n_sentence: 1298,
    n_resource: 6,
    created: "2025-11-09T15:54:51.600196+09:00",
  },
};
