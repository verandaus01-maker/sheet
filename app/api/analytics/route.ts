import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Get overall stats
    const totalClients = await prisma.client.count()
    const activeClients = await prisma.client.count({
      where: { status: 'ACTIVE' }
    })
    const leadsCount = await prisma.client.count({
      where: { status: 'LEAD' }
    })

    // Revenue stats
    const revenueData = await prisma.client.aggregate({
      _sum: {
        contractValue: true,
        paidAmount: true,
      },
    })

    // Tasks stats
    const totalTasks = await prisma.task.count()
    const completedTasks = await prisma.task.count({
      where: { status: 'COMPLETED' }
    })
    const overdueTasks = await prisma.task.count({
      where: {
        status: { in: ['TODO', 'IN_PROGRESS'] },
        dueDate: { lt: new Date() }
      }
    })

    // Client distribution by category
    const clientsByCategory = await prisma.client.groupBy({
      by: ['category'],
      _count: true,
    })

    // Client distribution by status
    const clientsByStatus = await prisma.client.groupBy({
      by: ['status'],
      _count: true,
    })

    // Recent activities
    const recentActivities = await prisma.activity.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        client: {
          select: {
            name: true,
            company: true,
          }
        }
      }
    })

    // Monthly revenue trend (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const clients = await prisma.client.findMany({
      where: {
        createdAt: { gte: sixMonthsAgo }
      },
      select: {
        createdAt: true,
        contractValue: true,
        paidAmount: true,
      }
    })

    // Group by month
    const monthlyRevenue = clients.reduce((acc: any, client) => {
      const month = new Date(client.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' })
      if (!acc[month]) {
        acc[month] = { month, revenue: 0, paid: 0 }
      }
      acc[month].revenue += client.contractValue
      acc[month].paid += client.paidAmount
      return acc
    }, {})

    return NextResponse.json({
      overview: {
        totalClients,
        activeClients,
        leadsCount,
        totalRevenue: revenueData._sum.contractValue || 0,
        paidRevenue: revenueData._sum.paidAmount || 0,
        pendingRevenue: (revenueData._sum.contractValue || 0) - (revenueData._sum.paidAmount || 0),
        totalTasks,
        completedTasks,
        overdueTasks,
      },
      clientsByCategory: clientsByCategory.map(c => ({
        category: c.category,
        count: c._count,
      })),
      clientsByStatus: clientsByStatus.map(c => ({
        status: c.status,
        count: c._count,
      })),
      monthlyRevenue: Object.values(monthlyRevenue),
      recentActivities,
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
