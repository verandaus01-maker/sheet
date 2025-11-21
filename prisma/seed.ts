import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create sample clients
  const client1 = await prisma.client.create({
    data: {
      name: 'John Smith',
      company: 'TechCorp Solutions',
      email: 'john@techcorp.com',
      phone: '+1-555-0101',
      category: 'DIGITAL_MARKETING',
      status: 'ACTIVE',
      contractValue: 50000,
      paidAmount: 25000,
      currency: 'USD',
      priority: 'HIGH',
      healthScore: 85,
      notes: 'Great client, very responsive and pays on time.',
      tasks: {
        create: [
          {
            title: 'Create Q1 marketing campaign',
            description: 'Design and launch social media campaign for Q1',
            status: 'IN_PROGRESS',
            priority: 'HIGH',
            dueDate: new Date('2025-02-01'),
          },
          {
            title: 'Monthly report review',
            description: 'Review and send monthly analytics report',
            status: 'TODO',
            priority: 'MEDIUM',
            dueDate: new Date('2025-01-30'),
          },
        ],
      },
      activities: {
        create: [
          {
            type: 'NOTE',
            title: 'Client onboarded',
            description: 'Successfully onboarded TechCorp Solutions',
          },
          {
            type: 'MEETING',
            title: 'Kickoff meeting completed',
            description: 'Discussed project goals and timeline',
          },
        ],
      },
    },
  })

  const client2 = await prisma.client.create({
    data: {
      name: 'Sarah Johnson',
      company: 'Global Travels Inc',
      email: 'sarah@globaltravels.com',
      phone: '+1-555-0202',
      category: 'TRAVEL',
      status: 'PROSPECT',
      contractValue: 75000,
      paidAmount: 0,
      currency: 'USD',
      priority: 'URGENT',
      healthScore: 60,
      notes: 'Interested in our premium travel package. Follow up next week.',
      tasks: {
        create: [
          {
            title: 'Send proposal',
            description: 'Prepare and send customized travel package proposal',
            status: 'TODO',
            priority: 'URGENT',
            dueDate: new Date('2025-01-25'),
          },
        ],
      },
      activities: {
        create: [
          {
            type: 'CALL',
            title: 'Initial consultation call',
            description: 'Discussed their travel needs and budget',
          },
        ],
      },
    },
  })

  const client3 = await prisma.client.create({
    data: {
      name: 'Michael Chen',
      company: 'E-Shop Master',
      email: 'michael@eshopmaster.com',
      phone: '+1-555-0303',
      category: 'ECOMMERCE',
      status: 'NEGOTIATION',
      contractValue: 100000,
      paidAmount: 10000,
      currency: 'USD',
      priority: 'HIGH',
      healthScore: 70,
      notes: 'Negotiating terms for annual e-commerce management contract.',
      tasks: {
        create: [
          {
            title: 'Revise contract terms',
            description: 'Update contract based on client feedback',
            status: 'IN_PROGRESS',
            priority: 'HIGH',
            dueDate: new Date('2025-01-27'),
          },
          {
            title: 'Schedule contract signing meeting',
            description: 'Set up meeting to finalize and sign contract',
            status: 'TODO',
            priority: 'MEDIUM',
            dueDate: new Date('2025-02-05'),
          },
        ],
      },
    },
  })

  const client4 = await prisma.client.create({
    data: {
      name: 'Emily Rodriguez',
      company: 'CloudSoft SaaS',
      email: 'emily@cloudsoft.com',
      phone: '+1-555-0404',
      category: 'SAAS',
      status: 'LEAD',
      contractValue: 30000,
      paidAmount: 0,
      currency: 'USD',
      priority: 'MEDIUM',
      healthScore: 40,
      notes: 'Interested in SaaS consulting. Waiting for budget approval.',
    },
  })

  const client5 = await prisma.client.create({
    data: {
      name: 'David Park',
      company: 'Consulting Pros',
      email: 'david@consultingpros.com',
      phone: '+1-555-0505',
      category: 'CONSULTING',
      status: 'COMPLETED',
      contractValue: 80000,
      paidAmount: 80000,
      currency: 'USD',
      priority: 'LOW',
      healthScore: 95,
      notes: 'Successfully completed consulting project. Excellent feedback received.',
      tasks: {
        create: [
          {
            title: 'Final report delivered',
            description: 'Comprehensive consulting report delivered to client',
            status: 'COMPLETED',
            priority: 'HIGH',
            completedAt: new Date('2025-01-15'),
          },
        ],
      },
    },
  })

  // Create some daily logs
  await prisma.dailyLog.create({
    data: {
      date: new Date('2025-01-20'),
      notes: 'Productive day! Had 3 client meetings and closed 2 deals. Need to follow up with Sarah from Global Travels tomorrow.',
      metrics: JSON.stringify({
        callsMade: 8,
        emailsSent: 15,
        meetingsHeld: 3,
        tasksCompleted: 5,
        revenue: 25000,
      }),
    },
  })

  await prisma.dailyLog.create({
    data: {
      date: new Date('2025-01-21'),
      notes: 'Focus on proposal writing today. Sent out 3 proposals including one for Global Travels. Waiting for responses.',
      metrics: JSON.stringify({
        callsMade: 5,
        emailsSent: 12,
        meetingsHeld: 1,
        tasksCompleted: 7,
        revenue: 0,
      }),
    },
  })

  console.log('Database seeded successfully!')
  console.log('Created clients:', [client1, client2, client3, client4, client5].length)
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
