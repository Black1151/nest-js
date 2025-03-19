"use server";

import { headers } from "next/headers";

/**
 * Calls your existing `/api/refresh` route to get new tokens
 * from the server side. We forward the user's cookies by
 * copying the "cookie" header from the current request.
 *
 * Returns true if refresh was successful, false otherwise.
 */

export async function attemptRefresh(): Promise<boolean> {
  try {
    const cookieHeader = headers().get("cookie") || "";
    // Instead of process.env.NEXT_PUBLIC_URL + '/api/refresh'
    // do a simple relative fetch in Next 13:
    const refreshResponse = await fetch("http://127.0.0.1:3000/api/refresh", {
      // const refreshResponse = await fetch("/api/refresh", {
      method: "POST",
      headers: { cookie: cookieHeader },
    });

    if (!refreshResponse.ok) {
      return false;
    }

    const data = await refreshResponse.json();
    if (data.error || data.success === false) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Refresh token error:", error);
    return false;
  }
}

/**
 * Minimal check for token expiry. You can also store 'roles' in the payload if you like.
 */
export async function isTokenExpired(token: string): Promise<boolean> {
  try {
    const payload = await JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString("utf-8")
    );
    if (!payload.exp) {
      return true;
    }
    const nowInSeconds = Math.floor(Date.now() / 1000);
    return nowInSeconds > payload.exp;
  } catch (err) {
    console.error("Failed to decode token", err);
    return true;
  }
}

/**
 * Simple role decoder. If you store roles in `payload.roles`, parse them.
 * Adjust as needed for your JWT structure.
 */
export async function decodeRoles(token: string): Promise<string[]> {
  try {
    const payload = await JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString("utf-8")
    );
    return payload.roles || [];
  } catch (err) {
    console.error("Failed to decode roles", err);
    return [];
  }
}
