import { LoaderCircle } from "lucide-react";

type Props = {
  isLoading: boolean;

  type?: "top" | "center-x";
};

export default function Loading({ isLoading, type }: Props) {
  if (!isLoading) {
    return null;
  }

  const circle = <LoaderCircle className="animate-spin" />;
  if (type === "center-x") {
    return <div className="flex justify-center p-4">{circle}</div>;
  }

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center justify-center p-2 bg-background rounded-full shadow-lg">
        {circle}
      </div>
    </div>
  );
}
