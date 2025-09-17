"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { encrypt, login, register, logout } from "@/lib/auth"

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const user = await login(email, password)
  if (!user) {
    return { error: "Invalid credentials" }
  }

  // Create session
  const session = await encrypt({ userId: user.id, email: user.email })
  cookies().set("session", session, {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  })

  redirect("/dashboard")
}

export async function registerAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string
  const role = formData.get("role") as "farmer" | "expert"
  const location = formData.get("location") as string
  const phoneNumber = formData.get("phoneNumber") as string

  if (!email || !password || !name || !role) {
    return { error: "All required fields must be filled" }
  }

  const user = await register({
    email,
    password,
    name,
    role,
    location,
    phoneNumber,
  })

  if (!user) {
    return { error: "User already exists or registration failed" }
  }

  // Create session
  const session = await encrypt({ userId: user.id, email: user.email })
  cookies().set("session", session, {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  })

  redirect("/dashboard")
}

export async function logoutAction() {
  await logout()
  redirect("/")
}
