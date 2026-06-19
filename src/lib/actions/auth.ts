// src/lib/actions/auth.ts

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerClient } from "../pocketbase/server";
import { ClientResponseError } from "pocketbase";

export type AuthResult =
  | { success: true }
  | { success: false; message: string; fields?: Record<string, string> };

export async function login(_: AuthResult | null, formData: FormData): Promise<AuthResult> {
  const client = await createServerClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, message: "Email and password are required." };
  }

  try {
    await client.collection("users").authWithPassword(email, password);
  } catch (e) {
    if (e instanceof ClientResponseError) {
      return { success: false, message: "Invalid email or password." };
    }
    return { success: false, message: "Something went wrong. Please try again." };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function register(_: AuthResult | null, formData: FormData): Promise<AuthResult> {
  const client = await createServerClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const passwordConfirm = formData.get("passwordConfirm") as string;

  if (!email || !password || !passwordConfirm) {
    return { success: false, message: "All fields are required." };
  }

  if (password !== passwordConfirm) {
    return {
      success: false,
      message: "Passwords do not match.",
      fields: { passwordConfirm: "Passwords do not match." },
    };
  }

  if (password.length < 8) {
    return {
      success: false,
      message: "Password must be at least 8 characters.",
      fields: { password: "Password must be at least 8 characters." },
    };
  }

  try {
    await client.collection("users").create({ email, password, passwordConfirm });
    await client.collection("users").authWithPassword(email, password);
  } catch (e) {
    if (e instanceof ClientResponseError) {
      const fields: Record<string, string> = {};
      if (e.data?.data) {
        for (const [key, val] of Object.entries(e.data.data)) {
          fields[key] = (val as { message: string }).message;
        }
      }
      return {
        success: false,
        message: "Registration failed. Please check the fields below.",
        fields,
      };
    }
    return { success: false, message: "Something went wrong. Please try again." };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function logout() {
  const client = await createServerClient();
  await client.authStore.clear();
  revalidatePath("/", "layout");
  redirect("/login");
}