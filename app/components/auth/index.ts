/**
 * Creates a URL to the login page with the current path as a redirect URL
 * @param currentPath - The current path that needs authentication
 * @returns The login URL with a redirect parameter
 */
export const createLoginUrl = (currentPath: string): string => {
  // Encode the current path to ensure special characters are properly handled
  const encodedPath = encodeURIComponent(currentPath);
  return `/login?redirectTo=${encodedPath}`;
};
