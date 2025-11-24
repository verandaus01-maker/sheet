import { prisma } from './prisma'

let isInitialized = false

export async function ensureDatabase() {
  if (isInitialized) return

  try {
    // Test database connection by attempting a simple query
    await prisma.$queryRaw`SELECT 1`

    // Check if the Client table has the new columns
    const tableInfo = await prisma.$queryRaw`PRAGMA table_info(Client)`
    const columns = (tableInfo as any[]).map((col: any) => col.name)

    const requiredColumns = [
      'alternatePhone',
      'whatsapp',
      'website',
      'address',
      'city',
      'state',
      'country',
      'leadSource',
      'referredBy',
      'statusReason',
      'pendingAmount',
      'paymentTerms',
      'nextPaymentDate',
      'overallProgress',
      'completedWork',
      'pendingWork',
      'currentMilestone',
      'accountManager',
      'preferredContactMethod',
      'communicationFrequency',
      'bestTimeToContact',
      'internalNotes'
    ]

    const missingColumns = requiredColumns.filter(col => !columns.includes(col))

    if (missingColumns.length > 0) {
      console.warn('⚠️ Database schema is missing columns:', missingColumns)
      console.warn('⚠️ Run "npm run db:push" to update the database schema')
      console.warn('⚠️ Or wait for the next deployment which will auto-sync the schema')
    } else {
      console.log('✅ Database schema is up to date')
    }

    isInitialized = true
  } catch (error: any) {
    // If table doesn't exist, that's okay - Prisma will create it
    if (error.message?.includes('no such table')) {
      console.log('📦 Database tables will be created on first use')
    } else {
      console.error('Database initialization check failed:', error.message)
    }
    isInitialized = true
  }
}
