import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const clientId = searchParams.get('clientId')

    const where: any = {}
    if (clientId) {
      where.clientId = clientId
    }

    const contacts = await prisma.contact.findMany({
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
        { isPrimary: 'desc' },
        { name: 'asc' }
      ]
    })

    return NextResponse.json(contacts)
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // If this is set as primary, unset other primary contacts for this client
    if (body.isPrimary) {
      await prisma.contact.updateMany({
        where: {
          clientId: body.clientId,
          isPrimary: true,
        },
        data: {
          isPrimary: false,
        },
      })
    }

    const contact = await prisma.contact.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        position: body.position,
        isPrimary: body.isPrimary || false,
        clientId: body.clientId,
      },
    })

    return NextResponse.json(contact, { status: 201 })
  } catch (error) {
    console.error('Error creating contact:', error)
    return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 })
  }
}
