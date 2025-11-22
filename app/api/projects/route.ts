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

    const projects = await prisma.project.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            company: true,
          }
        },
        tasks: true,
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const project = await prisma.project.create({
      data: {
        name: body.name,
        description: body.description,
        status: body.status || 'active',
        budget: body.budget || 0,
        spent: body.spent || 0,
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        clientId: body.clientId,
      },
    })

    // Create activity
    await prisma.activity.create({
      data: {
        type: 'NOTE',
        title: 'Project created',
        description: `New project: ${project.name}`,
        clientId: body.clientId,
      },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}
