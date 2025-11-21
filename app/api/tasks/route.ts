import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const clientId = searchParams.get('clientId')
    const status = searchParams.get('status')

    const where: any = {}

    if (clientId) {
      where.clientId = clientId
    }

    if (status) {
      where.status = status
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            company: true,
          }
        },
      },
      orderBy: [
        { priority: 'desc' },
        { dueDate: 'asc' }
      ]
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const task = await prisma.task.create({
      data: {
        title: body.title,
        description: body.description,
        status: body.status || 'TODO',
        priority: body.priority || 'MEDIUM',
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        reminderDate: body.reminderDate ? new Date(body.reminderDate) : null,
        clientId: body.clientId,
        projectId: body.projectId,
      },
    })

    // Create activity
    await prisma.activity.create({
      data: {
        type: 'TASK_CREATED',
        title: 'Task created',
        description: `New task: ${task.title}`,
        clientId: body.clientId,
      },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  }
}
