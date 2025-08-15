import { type ReactNode, useEffect, useState } from "react";

type Props = {
  children: () => ReactNode;
  fallback?: ReactNode;
};

/**
 * Renders children only on the client-side.
 * On the server, it renders an optional fallback.
 * This is useful to prevent hydration mismatches.
 */
export function ClientOnly({ children, fallback = null }: Props) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return fallback;
  }

  return <>{children()}</>;
}
