// src/lib/pocketbase/middleware.ts

import { NextRequest, NextResponse } from "next/server";
import PocketBase from "pocketbase";
import { COOKIE_NAME } from "./server";
import { SyncAuthStore } from "./stores/sync-auth-store";
import { TypedPocketBase } from "./types";

export async function updateSession(request: NextRequest) {
  console.log(">>> middleware hit:", request.nextUrl.pathname);

  let response = NextResponse.next();
  const client = new PocketBase(
    process.env.NEXT_PUBLIC_POCKETBASE_URL,
    new SyncAuthStore({
      save: (serializedPayload) => {
        request.cookies.set(COOKIE_NAME, serializedPayload);
        response = NextResponse.next({ request });
        response.cookies.set(COOKIE_NAME, serializedPayload);
      },
      clear: () => {
        request.cookies.delete(COOKIE_NAME);
        response = NextResponse.next({ request });
        response.cookies.delete(COOKIE_NAME);
      },
      initial: request.cookies.get(COOKIE_NAME)?.value,
    }),
  ) as TypedPocketBase;

  // >>> ADD THIS LOG BLOCK (right after client creation)
  const rawCookie = request.cookies.get(COOKIE_NAME)?.value;
  console.log("🧭 [MIDDLEWARE] Cookie parsing debug:", {
    pathname: request.nextUrl.pathname,
    rawCookiePresent: !!rawCookie,
    rawCookiePreview: rawCookie?.substring(0, 40) + "...",
    authStoreToken: client.authStore.token?.substring(0, 20) + "...",
    authStoreHasRecord: !!client.authStore.record,
    authStoreIsValid: client.authStore.isValid
  });

  console.log(">>> cookie value:", request.cookies.get(COOKIE_NAME)?.value?.substring(0, 50));
  console.log(">>> isValid:", client.authStore.isValid);

  if (client.authStore.isValid) {
    try {
      await client.collection("users").authRefresh();
    } catch {
      client.authStore.clear();
    }
  }

  const PUBLIC_ROUTES = ["/", "/login", "/register"];
  const PUBLIC_PREFIXES = ["/articles"];
  const pathname = request.nextUrl.pathname;
  const isPublic =
    PUBLIC_ROUTES.includes(pathname) ||
    PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));

  if (!client.authStore.isValid && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    response = NextResponse.redirect(url);
  }

  return response;
}