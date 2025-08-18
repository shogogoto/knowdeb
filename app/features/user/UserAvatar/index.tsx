import { Cloudinary } from "@cloudinary/url-gen";
import { type ComponentProps, memo } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/shared/components/ui/avatar";
import type { UserProps } from "../types";

type Props = UserProps & ComponentProps<typeof Avatar>;

const UserAvatar = memo(function UserAvatar({ user, ...props }: Props) {
  const cld = new Cloudinary({
    cloud: {
      cloudName: import.meta.env.VITE_CLOUD_NAME,
    },
  });

  // CLOUD_FOLDERを参照するとなぜかエラー
  // process.envにフロントエンドからアクセスしていたからだ！
  const prefix = import.meta.env.VITE_CLOUD_FOLDER || "avatar";
  const myImage = cld.image(`${prefix}/${user?.uid}`);
  myImage.format("auto").quality("auto");

  return (
    <Avatar {...props}>
      <AvatarImage
        src={user?.avatar_url || undefined}
        alt={user?.display_name || undefined}
      />
      <AvatarFallback>{user?.display_name?.charAt(0) || "N"}</AvatarFallback>
    </Avatar>
  );

  // return (
  //   <AdvancedImage
  //     cldImg={myImage}
  //     plugins={[lazyload(), responsive(), accessibility()]}
  //   />
  // );
});
export default UserAvatar;
