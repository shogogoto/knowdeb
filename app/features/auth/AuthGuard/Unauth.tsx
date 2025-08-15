import { TriangleAlert } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/shared/components/ui/button";
import {
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/shared/components/ui/card";
import { AuthCard } from "./component";

export default function Unauth() {
  return (
    <AuthCard>
      <CardHeader className="text-center space-y-4">
        <div className="mx-auto  p-3 rounded-full w-fit">
          <TriangleAlert className="h-12 w-12 text-destructive" />
        </div>
        <CardTitle className="text-2xl font-bold">認証が必要です</CardTitle>
        <CardDescription>
          このページを閲覧するにはログインしてください。
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-center">
        <Button asChild size="lg">
          <Link to="/login">ログインページへ</Link>
        </Button>
      </CardFooter>
    </AuthCard>
  );
}
