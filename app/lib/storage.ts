export function getItem(key: string): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage.getItem(key);
}

export function setItem(key: string, value: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Failed to set item in localStorage: ${key}`, error);
    return false;
  }
}

export function removeItem(key: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Failed to remove item from localStorage: ${key}`, error);
    return false;
  }
}

export function hasItem(key: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return window.localStorage.getItem(key) !== null;
}
