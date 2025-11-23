import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const date = searchParams.get('date')

    const where: any = {}

    if (date) {
      const targetDate = new Date(date)
      const nextDay = new Date(targetDate)
      nextDay.setDate(nextDay.getDate() + 1)

      where.date = {
        gte: targetDate,
        lt: nextDay,
      }
    }

    const logs = await prisma.dailyLog.findMany({
      where,
      orderBy: { date: 'desc' },
      take: 30,
    })

    return NextResponse.json(logs)
  } catch (error) {
    console.error('Error fetching daily logs:', error)
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const log = await prisma.dailyLog.create({
      data: {
        date: body.date ? new Date(body.date) : new Date(),
        notes: body.notes,
        metrics: body.metrics ? JSON.stringify(body.metrics) : null,
      },
    })

    return NextResponse.json(log, { status: 201 })
  } catch (error) {
    console.error('Error creating daily log:', error)
    return NextResponse.json({ error: 'Failed to create daily log' }, { status: 500 })
  }
}
