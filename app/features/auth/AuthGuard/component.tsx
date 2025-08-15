import type { PropsWithChildren } from "react";
import { Card } from "~/shared/components/ui/card";

export function AuthCard({ children }: PropsWithChildren) {
  return (
    <div
      className="flex justify-center items-center min-h-screen
                      bg-gray-100 text-gray-800 p-4
                      dark:bg-gray-900 dark:text-gray-200"
    >
      <Card
        className="w-full max-w-md
                  dark:bg-gray-800 dark:text-gray-100
                  sm:p-6 md:p-10"
      >
        {children}
      </Card>
    </div>
  );
}
