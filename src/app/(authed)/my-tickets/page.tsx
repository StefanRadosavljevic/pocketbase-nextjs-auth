// src/app/(authed)/my-tickets/page.tsx

import { createServerClient } from "@/lib/pocketbase/server";
import { MyTicketsClient } from "./page-client";

export default async function MyTicketsPage() {
    const client = await createServerClient();
    console.log("my-tickets token:", client.authStore.token);
    console.log("my-tickets isValid:", client.authStore.isValid);
    console.log("my-tickets record:", client.authStore.record?.id);
    return <MyTicketsClient />;
}