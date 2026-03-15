// src/components/google-sign-in-button.tsx

"use client";
import { usePocketBase } from "./pocketbase-provider";
import { useRouter } from "next/navigation";

export function GoogleSignInButton() {
    const pb = usePocketBase();
    const router = useRouter();

    async function handleGoogleSignIn() {
        try {
            const authData = await pb.collection("users").authWithOAuth2({
                provider: "google",
            });

            await fetch("/api/set-cookie", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token: authData.token,
                    record: authData.record,
                }),
            });

            router.push("/dashboard");
            router.refresh();
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <button onClick={handleGoogleSignIn} className="btn btn-outline w-full">
            Sign in with Google
        </button>
    );
}