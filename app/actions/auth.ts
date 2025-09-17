
'use server'

import { redirect } from 'next/navigation'
import { login, logout } from '@/lib/auth'

export async function loginAction(formData: FormData) {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
      throw new Error('Email and password are required')
    }

    if (!email.includes('@') || password.length < 6) {
      throw new Error('Invalid email format or password too short')
    }

    await login(formData)
    redirect('/dashboard')
  } catch (error) {
    console.error('Login error:', error)
    throw new Error(error instanceof Error ? error.message : 'Invalid credentials')
  }
}

export async function logoutAction() {
  try {
    await logout()
    redirect('/')
  } catch (error) {
    console.error('Logout error:', error)
    redirect('/')
  }
}

export async function registerAction(formData: FormData) {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string

    if (!email || !password || !name) {
      throw new Error('All fields are required')
    }

    if (!email.includes('@')) {
      throw new Error('Invalid email format')
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters')
    }

    if (name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters')
    }

    // Mock registration - in production, save to database
    console.log('Registering user:', { email, name })
    
    redirect('/auth/login?message=Registration successful! Please login.')
  } catch (error) {
    console.error('Registration error:', error)
    throw new Error(error instanceof Error ? error.message : 'Registration failed')
  }
}
