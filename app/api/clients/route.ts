import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateHealthScore } from '@/lib/utils'
import { ensureDatabase } from '@/lib/db-init'

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
        { name: { contains: search } },
        { company: { contains: search } },
        { email: { contains: search } },
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
    // Ensure database is initialized
    await ensureDatabase()

    const body = await request.json()

    const client = await prisma.client.create({
      data: {
        // Basic Information
        name: body.name,
        company: body.company,
        email: body.email,
        phone: body.phone,
        alternatePhone: body.alternatePhone,
        whatsapp: body.whatsapp,

        // Business Details
        category: body.category || 'DIGITAL_MARKETING',
        industry: body.industry,
        website: body.website,
        teamSize: body.teamSize,

        // Location
        address: body.address,
        city: body.city,
        state: body.state,
        country: body.country || 'India',

        // Lead Information
        leadSource: body.leadSource,
        referredBy: body.referredBy,

        // Status & Priority
        status: body.status || 'LEAD',
        statusReason: body.statusReason,
        priority: body.priority || 'MEDIUM',

        // Financial (INR by default)
        contractValue: body.contractValue || 0,
        paidAmount: body.paidAmount || 0,
        pendingAmount: body.pendingAmount || 0,
        currency: body.currency || 'INR',
        paymentTerms: body.paymentTerms,
        nextPaymentDate: body.nextPaymentDate ? new Date(body.nextPaymentDate) : null,

        // Important Dates
        nextFollowUp: body.nextFollowUp ? new Date(body.nextFollowUp) : null,
        expectedClose: body.expectedClose ? new Date(body.expectedClose) : null,
        contractStart: body.contractStart ? new Date(body.contractStart) : null,
        contractEnd: body.contractEnd ? new Date(body.contractEnd) : null,

        // Progress & Deliverables
        overallProgress: body.overallProgress || 0,
        completedWork: body.completedWork,
        pendingWork: body.pendingWork,
        currentMilestone: body.currentMilestone,

        // Team Assignment
        accountManager: body.accountManager,

        // Communication Preferences
        preferredContactMethod: body.preferredContactMethod,
        communicationFrequency: body.communicationFrequency,
        bestTimeToContact: body.bestTimeToContact,

        // Notes
        tags: body.tags ? JSON.stringify(body.tags) : null,
        notes: body.notes,
        internalNotes: body.internalNotes,
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
  } catch (error: any) {
    console.error('Error creating client:', error)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)

    // Check if it's a schema/column error
    if (error.message?.includes('no such column') || error.message?.includes('table') || error.code === 'P2010') {
      return NextResponse.json({
        error: 'Database schema outdated',
        details: 'The database schema needs to be updated. Please run "npm run db:push" locally or wait for the next deployment to auto-sync the schema.',
        technicalDetails: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      error: 'Failed to create client',
      details: error.message,
      code: error.code
    }, { status: 500 })
  }
}
