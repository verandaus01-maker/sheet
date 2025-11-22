import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const format = searchParams.get('format') || 'json'
    const status = searchParams.get('status')
    const category = searchParams.get('category')

    const where: any = {}
    if (status) where.status = status
    if (category) where.category = category

    const clients = await prisma.client.findMany({
      where,
      include: {
        tasks: true,
        projects: true,
      },
      orderBy: { createdAt: 'desc' }
    })

    if (format === 'csv') {
      // Generate CSV
      const headers = ['Name', 'Company', 'Email', 'Phone', 'Category', 'Status', 'Contract Value', 'Paid Amount', 'Health Score', 'Tasks', 'Projects']
      const rows = clients.map(client => [
        client.name,
        client.company || '',
        client.email,
        client.phone || '',
        client.category,
        client.status,
        client.contractValue,
        client.paidAmount,
        client.healthScore,
        client.tasks.length,
        client.projects.length,
      ])

      const csv = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n')

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="clients-export-${new Date().toISOString().split('T')[0]}.csv"`
        }
      })
    }

    // Return JSON with export-friendly format
    const exportData = clients.map(client => ({
      name: client.name,
      company: client.company,
      email: client.email,
      phone: client.phone,
      category: client.category,
      status: client.status,
      contractValue: client.contractValue,
      paidAmount: client.paidAmount,
      pendingAmount: client.contractValue - client.paidAmount,
      healthScore: client.healthScore,
      priority: client.priority,
      tasksCount: client.tasks.length,
      projectsCount: client.projects.length,
      firstContact: client.firstContact,
      lastContact: client.lastContact,
      notes: client.notes,
    }))

    return NextResponse.json(exportData)
  } catch (error) {
    console.error('Error exporting data:', error)
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 })
  }
}
