// src/app/(unauthed)/login/page-client.tsx

"use client";

import { useActionState } from "react";
import { login, AuthResult } from "@/lib/actions/auth";

export function LoginClient() {
    const [state, action, pending] = useActionState<AuthResult | null, FormData>(
        login,
        null
    );

    return (
        <form action={action} className="flex flex-col gap-2">
            <h1 className="mb-8 text-2xl">Log in</h1>

            {state && !state.success && (
                <p className="text-sm text-error">{state.message}</p>
            )}

            <input
                type="email"
                name="email"
                placeholder="Email"
                className="input w-full"
                disabled={pending}
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                className="input w-full"
                disabled={pending}
            />

            <button type="submit" className="btn btn-primary" disabled={pending}>
                {pending ? "Logging in..." : "Login"}
            </button>
        </form>
    );
}