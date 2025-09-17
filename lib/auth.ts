import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const key = new TextEncoder().encode('your-secret-key-change-this-in-production')

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key)
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  })
  return payload
}

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Mock authentication - replace with real auth
  const validCredentials = [
    { email: 'farmer@example.com', password: 'password123', role: 'farmer' },
    { email: 'expert@example.com', password: 'password123', role: 'expert' },
    { email: 'admin@example.com', password: 'password123', role: 'admin' },
  ]

  const user = validCredentials.find(u => u.email === email && u.password === password)

  if (!user) {
    throw new Error('Invalid credentials')
  }

  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const session = await encrypt({ userId: user.email, role: user.role, expires })

  cookies().set('session', session, { expires, httpOnly: true })
}

export async function logout() {
  cookies().set('session', '', { expires: new Date(0) })
}

export async function getSession() {
  const session = cookies().get('session')?.value
  if (!session) return null
  return await decrypt(session)
}

export async function getUser() {
  const session = await getSession()
  if (!session) return null
  return { email: session.userId, role: session.role }
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get('session')?.value
  if (!session) return

  const parsed = await decrypt(session)
  parsed.expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const res = NextResponse.next()
  res.cookies.set({
    name: 'session',
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  })
  return res
}