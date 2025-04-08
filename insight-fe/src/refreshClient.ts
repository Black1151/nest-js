// refreshClient.ts

let inFlightRefreshPromise: Promise<void> | null = null;

/**
 * This function ensures we only call "/api/refresh" once at a time.
 * If multiple calls come in, they share the same promise.
 */
export async function ensureRefresh(): Promise<void> {
  if (inFlightRefreshPromise) {
    // A refresh is already in progress
    return inFlightRefreshPromise;
  }

  inFlightRefreshPromise = (async () => {
    try {
      const resp = await fetch("/api/refresh", {
        method: "POST",
        credentials: "include",
      });
      // If the refresh fails, handle gracefully:
      if (!resp.ok) {
        throw new Error("Refresh failed");
      }
      // This route sets cookies, you can parse the JSON if needed:
      // const data = await resp.json();
    } finally {
      // Clear so we can refresh again later if needed
      inFlightRefreshPromise = null;
    }
  })();

  return inFlightRefreshPromise;
}
