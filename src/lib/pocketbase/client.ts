// src/lib/pocketbase/client.ts

import PocketBase from "pocketbase";
import { TypedPocketBase } from "./types";

export function createBrowserClient() {
  const client = new PocketBase(
    process.env.NEXT_PUBLIC_POCKETBASE_URL,
  ) as TypedPocketBase;

  if (typeof document !== "undefined") {
    // >>> ADD THESE LOGS around loadFromCookie
    console.log("🍪 [BROWSER CLIENT] document.cookie before loadFromCookie:", document.cookie);
    console.log("🍪 [BROWSER CLIENT] pb_auth cookie value:", document.cookie.split('; ').find(row => row.startsWith('pb_auth='))?.split('=')[1]?.substring(0, 50) + "...");

    client.authStore.loadFromCookie(document.cookie);

    console.log("🔐 [BROWSER CLIENT] authStore AFTER loadFromCookie:", {
      token: client.authStore.token?.substring(0, 20) + "...",
      hasRecord: !!client.authStore.record,
      isValid: client.authStore.isValid
    });

    // >>> ADD THESE LOGS around onChange
    client.authStore.onChange(() => {
      const exported = client.authStore.exportToCookie({ httpOnly: false });
      console.log("✍️ [BROWSER CLIENT] exportToCookie output:", exported?.substring(0, 80) + "...");
      console.log("🍪 [BROWSER CLIENT] document.cookie AFTER onChange:", document.cookie);
      document.cookie = exported;
    });
  }

  return client;
}