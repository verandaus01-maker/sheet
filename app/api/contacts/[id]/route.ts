import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const contact = await prisma.contact.findUnique({
      where: { id: params.id }
    })

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
    }

    // If setting as primary, unset other primary contacts for this client
    if (body.isPrimary) {
      await prisma.contact.updateMany({
        where: {
          clientId: contact.clientId,
          isPrimary: true,
          id: { not: params.id },
        },
        data: {
          isPrimary: false,
        },
      })
    }

    const updatedContact = await prisma.contact.update({
      where: { id: params.id },
      data: body,
    })

    return NextResponse.json(updatedContact)
  } catch (error) {
    console.error('Error updating contact:', error)
    return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.contact.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting contact:', error)
    return NextResponse.json({ error: 'Failed to deleting contact' }, { status: 500 })
  }
}
