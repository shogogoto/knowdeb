import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useAuth } from "~/features/auth/AuthProvider";
import { getTransformedImageUrl } from "../../libs/image";
import UploadWidget from "../UploadWidget";

type Props = {
  image_url: string;
};

export default function ImageEditor({ image_url }: Props) {
  const { user } = useAuth();
  const avatarDisplayUrl = getTransformedImageUrl(image_url, 128, 128, "fill");

  return (
    <div className="flex flex-col items-center space-y-4">
      <Label className="block text-sm font-medium text-gray-700">
        プロフィール画像
      </Label>
      <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-border">
        {avatarDisplayUrl ? (
          <img
            src={avatarDisplayUrl}
            alt="プロフィール画像"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
            <span className="text-sm">画像なし</span>
          </div>
        )}
      </div>
      <UploadWidget
        publicId={user?.uid as string}
        // @ts-ignore
        onUploadSuccess={(imageUrl) => {
          //if (user) {
          //  form.update({ name: "avatar_url", value: imageUrl });
          //}
        }}
      />
      <Input
      //{...getInputProps(fields.avatar_url, { type: "hidden" })}
      //name={fields.avatar_url.name}
      //defaultValue={fields.avatar_url.initialValue}
      />
      <Button
        type="button"
        variant="ghost"
        className="text-destructive hover:text-destructive-foreground"
        //onClick={() => form.update({ name: "avatar_url", value: "" })}
      >
        画像を削除
      </Button>
    </div>
  );
}
