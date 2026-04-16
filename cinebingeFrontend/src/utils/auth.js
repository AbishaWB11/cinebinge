export function getAuthToken() {
  const directToken = localStorage.getItem("token");

  if (directToken && directToken !== "undefined" && directToken !== "null") {
    return directToken;
  }

  const jsonKeys = ["user", "userInfo", "auth"];

  for (const key of jsonKeys) {
    const rawValue = localStorage.getItem(key);

    if (!rawValue) {
      continue;
    }

    try {
      const parsedValue = JSON.parse(rawValue);

      if (parsedValue?.token) {
        return parsedValue.token;
      }
    } catch {
      // Ignore malformed storage entries and keep checking.
    }
  }

  return null;
}
