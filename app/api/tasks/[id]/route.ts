import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const currentTask = await prisma.task.findUnique({
      where: { id: params.id }
    })

    if (!currentTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    const task = await prisma.task.update({
      where: { id: params.id },
      data: {
        ...body,
        completedAt: body.status === 'COMPLETED' ? new Date() : null,
      },
    })

    // Log task completion
    if (body.status === 'COMPLETED' && currentTask.status !== 'COMPLETED') {
      await prisma.activity.create({
        data: {
          type: 'TASK_COMPLETED',
          title: 'Task completed',
          description: `Completed task: ${task.title}`,
          clientId: task.clientId,
        },
      })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.task.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 })
  }
}
