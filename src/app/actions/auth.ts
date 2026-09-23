"use server";

import { cookies } from "next/headers";
import { getPayload } from "@/lib/payload";

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    const payload = await getPayload();
    const result = await payload.login({
      collection: "users",
      data: {
        email,
        password,
      },
    });

    if (result.token) {
      // Set the token in cookies for Next.js to remember
      const cookieStore = await cookies();
      cookieStore.set("payload-token", result.token, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
      return { success: true, user: result.user };
    }
    
    return { error: "Login failed. Invalid credentials." };
  } catch (error: any) {
    console.error("Login Error:", error);
    return { error: error.message || "Invalid email or password." };
  }
}

export async function registerAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const role = formData.get("role") as "jobseeker" | "employer" || "jobseeker";

  if (!email || !password || !name) {
    return { error: "All fields are required." };
  }

  try {
    const payload = await getPayload();
    
    // Create the user
    const user = await payload.create({
      collection: "users",
      data: {
        email,
        password,
        name,
        role,
      },
    });

    if (user) {
      // Auto-login after registration
      const loginResult = await payload.login({
        collection: "users",
        data: { email, password },
      });

      if (loginResult.token) {
        const cookieStore = await cookies();
        cookieStore.set("payload-token", loginResult.token, {
          httpOnly: true,
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        });
        return { success: true, user: loginResult.user };
      }
    }
    
    return { error: "Registration failed." };
  } catch (error: any) {
    console.error("Register Error:", error);
    return { error: error.message || "Registration failed. Email may already exist." };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("payload-token");
  return { success: true };
}
