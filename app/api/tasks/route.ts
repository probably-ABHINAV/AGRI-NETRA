import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase'

export async function GET() {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient()
    if (!supabase) {
      // Return mock tasks for development
      const mockTasks = [
        { id: 1, text: "Irrigate Field A (Wheat)", completed: false, priority: "high" },
        { id: 2, text: "Apply NPK fertilizer to Field B (Rice)", completed: false, priority: "high" },
        { id: 3, text: "Scout for pests in Tomato patch", completed: true, priority: "medium" },
        { id: 4, text: "Check water levels in main reservoir", completed: false, priority: "low" },
      ]
      return NextResponse.json({ success: true, data: mockTasks })
    }

    // Get user profile ID
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', user.email)
      .single()

    if (!profile) {
      return NextResponse.json({ success: true, data: [] })
    }

    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Map database fields to API response
    const tasksData = tasks.map(task => ({
      id: task.id,
      text: task.title,
      description: task.description,
      completed: task.completed,
      priority: task.priority,
      dueDate: task.due_date,
      createdAt: task.created_at,
    }))

    return NextResponse.json({ success: true, data: tasksData })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    if (!body.text && !body.title) {
      return NextResponse.json({ error: 'Task title is required' }, { status: 400 })
    }

    const supabase = createClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    // Get user profile ID
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', user.email)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    const taskData = {
      user_id: profile.id,
      farm_id: body.farmId || null,
      title: body.text || body.title,
      description: body.description || null,
      priority: body.priority || 'medium',
      completed: body.completed || false,
      due_date: body.dueDate || null,
    }

    const { data: task, error } = await supabase
      .from('tasks')
      .insert(taskData)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
    }

    const responseData = {
      id: task.id,
      text: task.title,
      description: task.description,
      completed: task.completed,
      priority: task.priority,
      dueDate: task.due_date,
      createdAt: task.created_at,
    }

    return NextResponse.json({ success: true, data: responseData }, { status: 201 })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}