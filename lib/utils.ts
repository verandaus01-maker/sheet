import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
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

// Status definitions and guidance
export function getStatusDefinition(status: string): { title: string; description: string; when: string } {
  const definitions: Record<string, { title: string; description: string; when: string }> = {
    LEAD: {
      title: "Lead",
      description: "Initial contact or inquiry received. Potential client showing interest.",
      when: "Use when: New inquiry, first contact made, collecting basic information"
    },
    PROSPECT: {
      title: "Prospect",
      description: "Qualified lead actively engaged in discussions. Mutual interest confirmed.",
      when: "Use when: Had meaningful conversation, needs identified, proposal being prepared"
    },
    NEGOTIATION: {
      title: "Negotiation",
      description: "Actively negotiating terms, pricing, and contract details.",
      when: "Use when: Proposal sent, discussing terms, finalizing pricing and deliverables"
    },
    ACTIVE: {
      title: "Active",
      description: "Contract signed and project/service delivery in progress.",
      when: "Use when: Deal closed, actively working on project, regular communication happening"
    },
    ON_HOLD: {
      title: "On Hold",
      description: "Project temporarily paused. Client still engaged but work suspended.",
      when: "Use when: Client requested pause, waiting for resources, seasonal break"
    },
    COMPLETED: {
      title: "Completed",
      description: "Project successfully finished and delivered. Contract fulfilled.",
      when: "Use when: All deliverables done, final payment received, client satisfied"
    },
    LOST: {
      title: "Lost",
      description: "Client chose not to proceed or went with competitor.",
      when: "Use when: Deal lost, client unresponsive, chose another provider"
    }
  }
  return definitions[status] || { title: status, description: "No description", when: "" }
}

// Priority definitions and guidance
export function getPriorityDefinition(priority: string): { title: string; description: string; when: string } {
  const definitions: Record<string, { title: string; description: string; when: string }> = {
    LOW: {
      title: "Low Priority",
      description: "No urgency. Can be handled in regular workflow.",
      when: "Use when: No deadline pressure, routine maintenance, future opportunities"
    },
    MEDIUM: {
      title: "Medium Priority",
      description: "Important but not critical. Should be addressed within normal timeframe.",
      when: "Use when: Standard projects, regular follow-ups, scheduled deliverables"
    },
    HIGH: {
      title: "High Priority",
      description: "Requires prompt attention. Important client or approaching deadline.",
      when: "Use when: Key client, deadline within week, significant revenue potential"
    },
    URGENT: {
      title: "Urgent",
      description: "Critical and time-sensitive. Requires immediate action.",
      when: "Use when: Immediate deadline, client escalation, crisis management needed"
    }
  }
  return definitions[priority] || { title: priority, description: "No description", when: "" }
}

// Task status definitions
export function getTaskStatusDefinition(status: string): { title: string; description: string } {
  const definitions: Record<string, { title: string; description: string }> = {
    TODO: {
      title: "To Do",
      description: "Task identified but not started yet"
    },
    IN_PROGRESS: {
      title: "In Progress",
      description: "Actively being worked on"
    },
    BLOCKED: {
      title: "Blocked",
      description: "Cannot proceed due to dependency or issue"
    },
    REVIEW: {
      title: "In Review",
      description: "Completed and awaiting review/approval"
    },
    COMPLETED: {
      title: "Completed",
      description: "Finished and approved"
    },
    CANCELLED: {
      title: "Cancelled",
      description: "No longer needed or relevant"
    }
  }
  return definitions[status] || { title: status, description: "No description" }
}
