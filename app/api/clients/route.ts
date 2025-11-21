import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateHealthScore } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const where: any = {}

    if (status) {
      where.status = status
    }

    if (category) {
      where.category = category
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    const clients = await prisma.client.findMany({
      where,
      include: {
        tasks: {
          where: {
            status: { in: ['TODO', 'IN_PROGRESS'] }
          }
        },
        activities: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        },
        projects: true,
      },
      orderBy: { updatedAt: 'desc' }
    })

    // Update health scores
    const clientsWithHealth = clients.map(client => ({
      ...client,
      healthScore: calculateHealthScore(client)
    }))

    return NextResponse.json(clientsWithHealth)
  } catch (error) {
    console.error('Error fetching clients:', error)
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const client = await prisma.client.create({
      data: {
        name: body.name,
        company: body.company,
        email: body.email,
        phone: body.phone,
        category: body.category,
        status: body.status || 'LEAD',
        contractValue: body.contractValue || 0,
        paidAmount: body.paidAmount || 0,
        currency: body.currency || 'USD',
        expectedClose: body.expectedClose ? new Date(body.expectedClose) : null,
        priority: body.priority || 'MEDIUM',
        tags: body.tags ? JSON.stringify(body.tags) : null,
        notes: body.notes,
      },
    })

    // Create initial activity
    await prisma.activity.create({
      data: {
        type: 'NOTE',
        title: 'Client created',
        description: `New client ${client.name} added to the system`,
        clientId: client.id,
      },
    })

    return NextResponse.json(client, { status: 201 })
  } catch (error) {
    console.error('Error creating client:', error)
    return NextResponse.json({ error: 'Failed to create client' }, { status: 500 })
  }
}
