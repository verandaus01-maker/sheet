import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await prisma.client.findUnique({
      where: { id: params.id },
      include: {
        tasks: {
          orderBy: { dueDate: 'asc' }
        },
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 50
        },
        projects: {
          include: {
            tasks: true
          }
        },
        contacts: true,
        files: true,
      },
    })

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    return NextResponse.json(client)
  } catch (error) {
    console.error('Error fetching client:', error)
    return NextResponse.json({ error: 'Failed to fetch client' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const currentClient = await prisma.client.findUnique({
      where: { id: params.id }
    })

    if (!currentClient) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    // Convert date strings to Date objects
    const updateData: any = { ...body }

    // Handle date fields
    if (body.nextPaymentDate) updateData.nextPaymentDate = new Date(body.nextPaymentDate)
    if (body.nextFollowUp) updateData.nextFollowUp = new Date(body.nextFollowUp)
    if (body.expectedClose) updateData.expectedClose = new Date(body.expectedClose)
    if (body.contractStart) updateData.contractStart = new Date(body.contractStart)
    if (body.contractEnd) updateData.contractEnd = new Date(body.contractEnd)

    // Always update these
    updateData.lastContact = new Date()
    updateData.updatedAt = new Date()

    const client = await prisma.client.update({
      where: { id: params.id },
      data: updateData,
    })

    // Log status change
    if (body.status && body.status !== currentClient.status) {
      await prisma.activity.create({
        data: {
          type: 'STATUS_CHANGE',
          title: 'Status updated',
          description: `Status changed from ${currentClient.status} to ${body.status}`,
          clientId: client.id,
        },
      })
    }

    return NextResponse.json(client)
  } catch (error) {
    console.error('Error updating client:', error)
    return NextResponse.json({ error: 'Failed to update client' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.client.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting client:', error)
    return NextResponse.json({ error: 'Failed to delete client' }, { status: 500 })
  }
}
