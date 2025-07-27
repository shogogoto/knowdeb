import {
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { AuthCard } from "./component";

export default function AuthGuardLoading() {
  return (
    <AuthCard>
      <CardHeader className="text-center space-y-4">
        <CardTitle className="text-2xl font-bold">Loading User...</CardTitle>
        <CardDescription>しばらくお待ちください。</CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-center">
        <div className="mt-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto" />
        </div>
      </CardFooter>
    </AuthCard>
  );
}
