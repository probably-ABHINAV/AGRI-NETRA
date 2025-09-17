import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const secretKey = process.env.JWT_SECRET || "agrinetra-secure-development-key-2024-v1"
const key = new TextEncoder().encode(secretKey)

export interface User {
  id: string
  email: string
  name: string
  role: "farmer" | "expert" | "admin"
  farmId?: string
  location?: string
  phoneNumber?: string
}

// Mock user database
const users: User[] = [
  {
    id: "1",
    email: "farmer@example.com",
    name: "John Farmer",
    role: "farmer",
    farmId: "farm-001",
    location: "Punjab, India",
    phoneNumber: "+91-9876543210",
  },
  {
    id: "2",
    email: "expert@example.com",
    name: "Dr. Sarah Expert",
    role: "expert",
    location: "Delhi, India",
    phoneNumber: "+91-9876543211",
  },
  {
    id: "3",
    email: "admin@example.com",
    name: "Admin User",
    role: "admin",
    location: "Mumbai, India",
    phoneNumber: "+91-9876543212",
  },
]

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key)
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  })
  return payload
}

export async function login(email: string, password: string): Promise<User | null> {
  // Mock authentication - in production, verify against hashed passwords
  const user = users.find((u) => u.email === email)
  if (user && password === "password123") {
    return user
  }
  return null
}

export async function register(userData: {
  email: string
  password: string
  name: string
  role: "farmer" | "expert"
  location?: string
  phoneNumber?: string
}): Promise<User | null> {
  // Check if user already exists
  if (users.find((u) => u.email === userData.email)) {
    return null
  }

  const newUser: User = {
    id: (users.length + 1).toString(),
    email: userData.email,
    name: userData.name,
    role: userData.role,
    location: userData.location,
    phoneNumber: userData.phoneNumber,
    farmId: userData.role === "farmer" ? `farm-${users.length + 1}` : undefined,
  }

  users.push(newUser)
  return newUser
}

export async function getUser(): Promise<User | null> {
  const session = cookies().get("session")?.value
  if (!session) return null

  try {
    const payload = await decrypt(session)
    const user = users.find((u) => u.id === payload.userId)
    return user || null
  } catch (error) {
    return null
  }
}

export async function logout() {
  cookies().set("session", "", { expires: new Date(0) })
}
