// src/app/(unauthed)/register/page-client.tsx

"use client";

import { useActionState } from "react";
import { register, AuthResult } from "@/lib/actions/auth";

export function RegisterClient() {
    const [state, action, pending] = useActionState<AuthResult | null, FormData>(
        register,
        null
    );

    return (
        <form action={action} className="flex flex-col gap-2">
            <h1 className="mb-8 text-2xl">Register</h1>

            {state && !state.success && !state.fields && (
                <p className="text-sm text-error">{state.message}</p>
            )}

            <div className="flex flex-col gap-1">
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="input w-full"
                    disabled={pending}
                />
                {state?.success === false && state.fields?.email && (
                    <p className="text-xs text-error">{state.fields.email}</p>
                )}
            </div>

            <div className="flex flex-col gap-1">
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="input w-full"
                    disabled={pending}
                />
                {state?.success === false && state.fields?.password && (
                    <p className="text-xs text-error">{state.fields.password}</p>
                )}
            </div>

            <div className="flex flex-col gap-1">
                <input
                    type="password"
                    name="passwordConfirm"
                    placeholder="Confirm password"
                    className="input w-full"
                    disabled={pending}
                />
                {state?.success === false && state.fields?.passwordConfirm && (
                    <p className="text-xs text-error">{state.fields.passwordConfirm}</p>
                )}
            </div>

            <button type="submit" className="btn btn-primary" disabled={pending}>
                {pending ? "Registering..." : "Register"}
            </button>
        </form>
    );
}