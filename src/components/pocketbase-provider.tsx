// src/components/pocketbase-provider.tsx

"use client";

import { createBrowserClient } from "@/lib/pocketbase/client";
import { TypedPocketBase } from "@/lib/pocketbase/types";
import { AuthRecord } from "pocketbase";
import { createContext, useContext, useEffect, useRef } from "react";

const PocketBaseContext = createContext<TypedPocketBase | null>(null);

export function usePocketBase() {
  return useContext(PocketBaseContext)!;
}

export function useUser() {
  const client = usePocketBase();
  return client.authStore.record;
}

export function PocketBaseProvider({
  initialToken,
  initialUser,
  children,
}: {
  initialToken: string;
  initialUser: AuthRecord;
  children?: React.ReactNode;
}) {
  // >>> ADD THIS LOG (right at the start of the function)
  console.log("📦 [PROVIDER] Received from server:", {
    initialToken: initialToken ? initialToken.substring(0, 20) + "..." : "empty",
    initialUser: initialUser?.email || initialUser?.id || "undefined",
    hasInitialUser: !!initialUser
  });

  // >>> ADD THIS LOG (right after the line below)
  const clientRef = useRef<TypedPocketBase>(createBrowserClient());
  console.log("🔐 [PROVIDER] Browser client authStore after create:", {
    token: clientRef.current.authStore.token?.substring(0, 20) + "...",
    hasRecord: !!clientRef.current.authStore.record,
    isValid: clientRef.current.authStore.isValid
  });

  clientRef.current.authStore.save(initialToken, initialUser);

  useEffect(() => {
    async function authRefresh() {
      if (clientRef.current.authStore.isValid) {
        try {
          await clientRef.current.collection("users").authRefresh();
          console.log("✅ [PROVIDER] authRefresh succeeded");
        } catch (e) {
          console.warn("❌ [PROVIDER] authRefresh failed:", e);
          clientRef.current.authStore.clear();
        }
      } else {
        console.log("⚠️ [PROVIDER] authRefresh skipped - not isValid");
      }
    }

    authRefresh();
  }, [initialToken, initialUser]);

  return (
    <PocketBaseContext.Provider value={clientRef.current}>
      {children}
    </PocketBaseContext.Provider>
  );
}