
'use server';

import { redirect } from 'next/navigation'
import { login, register, logout } from '@/lib/auth'

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    throw new Error('Email and password are required')
  }

  if (!email.includes('@') || password.length < 6) {
    throw new Error('Invalid email format or password too short')
  }

  try {
    await login(formData)
  } catch (error) {
    console.error('Login error:', error)
    throw new Error(error instanceof Error ? error.message : 'Invalid credentials')
  }

  redirect('/dashboard')
}

export async function logoutAction() {
  try {
    await logout()
  } catch (error) {
    console.error('Logout error:', error)
  }
  
  redirect('/')
}

export async function registerAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string
  const phone = formData.get('phoneNumber') as string
  const role = formData.get('role') as string
  const state = formData.get('state') as string

  console.log('🔍 Registration attempt:', { email, password: password ? '[PRESENT]' : '[MISSING]', name, phone, role, state })

  // Validation checks
  if (!email || !password || !name) {
    console.log('❌ Validation failed: missing required fields')
    redirect('/auth/signup?error=Email, password, and name are required')
    return
  }

  if (!email.includes('@')) {
    redirect('/auth/signup?error=Invalid email format')
    return
  }

  if (password.length < 8) {
    redirect('/auth/signup?error=Password must be at least 8 characters')
    return
  }

  if (name.trim().length < 2) {
    redirect('/auth/signup?error=Name must be at least 2 characters')
    return
  }

  try {
    // Register user in database
    console.log('✅ Calling register function with data:', {
      email,
      fullName: name,
      phone: phone || undefined,
      role: role || 'farmer',
      state: state || undefined
    })
    
    const result = await register({
      email,
      password,
      fullName: name,
      phone: phone || undefined,
      role: role || 'farmer',
      state: state || undefined
    })

    console.log('✅ Registration successful:', result)
  } catch (error) {
    console.error('❌ Registration error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Registration failed'
    redirect(`/auth/signup?error=${encodeURIComponent(errorMessage)}`)
    return
  }

  redirect('/auth/login?message=Registration successful! Please login with your new credentials.')
}
