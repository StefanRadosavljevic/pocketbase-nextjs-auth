// src/app/(unauthed)/login/page.tsx

import { login } from "@/lib/actions/auth";
import { GoogleSignInButton } from "@/components/google-sign-in-button";

export default async function Login() {
  return (
    <form action={login} className="flex flex-col gap-2">
      <h1 className="mb-8 text-2xl">Log in</h1>
      <input
        type="email"
        name="email"
        placeholder="Email"
        className="input w-full"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        className="input w-full"
      />
      <button type="submit" className="btn btn-primary">
        Login
      </button>
      <div className="divider">OR</div>
      <GoogleSignInButton />
    </form>
  );
}