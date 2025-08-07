export function easyStorage(key: string) {
  return {
    getItem: () => getItem(key),
    setItem: (value: unknown) => setItem(key, value),
    removeItem: () => removeItem(key),
    hasItem: () => hasItem(key),
  };
}

export function getItem(key: string) {
  if (typeof window === "undefined") {
    return null;
  }
  const item = window.localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
}

export function setItem(key: string, value: unknown): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    // 空の場合
    if (!value) {
      removeItem(key);
    }
    const item = typeof value === "string" ? value : JSON.stringify(value);
    window.localStorage.setItem(key, item);
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
