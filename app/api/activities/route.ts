import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const activity = await prisma.activity.create({
      data: {
        type: body.type,
        title: body.title,
        description: body.description,
        metadata: body.metadata ? JSON.stringify(body.metadata) : null,
        clientId: body.clientId,
      },
    })

    // Update client's last contact
    await prisma.client.update({
      where: { id: body.clientId },
      data: { lastContact: new Date() },
    })

    return NextResponse.json(activity, { status: 201 })
  } catch (error) {
    console.error('Error creating activity:', error)
    return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 })
  }
}
