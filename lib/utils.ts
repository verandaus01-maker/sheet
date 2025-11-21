import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date))
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

export function calculateHealthScore(client: {
  lastContact: Date | string
  paidAmount: number
  contractValue: number
  status: string
}): number {
  let score = 50 // Base score

  // Last contact recency (0-30 points)
  const daysSinceContact = Math.floor(
    (new Date().getTime() - new Date(client.lastContact).getTime()) / (1000 * 60 * 60 * 24)
  )
  if (daysSinceContact < 7) score += 30
  else if (daysSinceContact < 14) score += 20
  else if (daysSinceContact < 30) score += 10
  else score -= 10

  // Payment status (0-30 points)
  const paymentRatio = client.contractValue > 0 ? client.paidAmount / client.contractValue : 0
  score += Math.floor(paymentRatio * 30)

  // Status (0-20 points)
  const statusScores: Record<string, number> = {
    ACTIVE: 20,
    NEGOTIATION: 15,
    PROSPECT: 10,
    LEAD: 5,
    ON_HOLD: -10,
    LOST: -20,
  }
  score += statusScores[client.status] || 0

  return Math.max(0, Math.min(100, score))
}

export function getHealthScoreColor(score: number): string {
  if (score >= 75) return "text-green-600 bg-green-50"
  if (score >= 50) return "text-yellow-600 bg-yellow-50"
  if (score >= 25) return "text-orange-600 bg-orange-50"
  return "text-red-600 bg-red-50"
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    LEAD: "bg-gray-100 text-gray-800",
    PROSPECT: "bg-blue-100 text-blue-800",
    NEGOTIATION: "bg-purple-100 text-purple-800",
    ACTIVE: "bg-green-100 text-green-800",
    ON_HOLD: "bg-yellow-100 text-yellow-800",
    COMPLETED: "bg-teal-100 text-teal-800",
    LOST: "bg-red-100 text-red-800",
  }
  return colors[status] || "bg-gray-100 text-gray-800"
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    LOW: "text-gray-600",
    MEDIUM: "text-blue-600",
    HIGH: "text-orange-600",
    URGENT: "text-red-600",
  }
  return colors[priority] || "text-gray-600"
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    DIGITAL_MARKETING: "📱",
    TRAVEL: "✈️",
    CONSULTING: "💼",
    ECOMMERCE: "🛒",
    SAAS: "💻",
    OTHER: "📋",
  }
  return icons[category] || "📋"
}

export function exportToCSV(data: any[], filename: string): void {
  const headers = Object.keys(data[0] || {})
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers.map((header) => JSON.stringify(row[header] || "")).join(",")
    ),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}.csv`
  link.click()
}
