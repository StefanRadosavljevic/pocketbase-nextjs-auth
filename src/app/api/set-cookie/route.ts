// src/app/api/set-cookie/route.ts

import { COOKIE_NAME } from "@/lib/pocketbase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { token, record } = await request.json();
    const cookieStore = await cookies();

    cookieStore.set(COOKIE_NAME, JSON.stringify({ token, record }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    });

    return NextResponse.json({ success: true });
}