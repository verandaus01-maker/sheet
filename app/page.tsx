"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate, getStatusColor, getCategoryIcon, getHealthScoreColor } from '@/lib/utils'
import {
  Plus, TrendingUp, Users, DollarSign, CheckCircle, AlertCircle,
  Calendar, Filter, Search, Download, BarChart3
} from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [clients, setClients] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ status: 'all', category: 'all' })
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddClient, setShowAddClient] = useState(false)

  useEffect(() => {
    fetchData()
  }, [filter])

  const fetchData = async () => {
    try {
      const [analyticsRes, clientsRes, tasksRes] = await Promise.all([
        fetch('/api/analytics'),
        fetch(`/api/clients?${filter.status !== 'all' ? `status=${filter.status}` : ''}${filter.category !== 'all' ? `&category=${filter.category}` : ''}`),
        fetch('/api/tasks')
      ])

      const [analyticsData, clientsData, tasksData] = await Promise.all([
        analyticsRes.json(),
        clientsRes.json(),
        tasksRes.json()
      ])

      setAnalytics(analyticsData)
      setClients(clientsData)
      setTasks(tasksData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredClients = clients.filter(client =>
    searchQuery === '' ||
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Client Management System</h1>
              <p className="text-sm text-gray-500 mt-1">Advanced dashboard for managing all your clients</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => window.location.href = '/daily-log'}>
                <Calendar className="h-4 w-4 mr-2" />
                Daily Log
              </Button>
              <Button onClick={() => setShowAddClient(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Client
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                <Users className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analytics.overview.totalClients}</div>
                <p className="text-xs text-green-600 mt-1">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  {analytics.overview.activeClients} active
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {formatCurrency(analytics.overview.totalRevenue)}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {formatCurrency(analytics.overview.paidRevenue)} paid
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tasks</CardTitle>
                <CheckCircle className="h-5 w-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analytics.overview.totalTasks}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {analytics.overview.completedTasks} completed
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
                <AlertCircle className="h-5 w-5 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  {analytics.overview.overdueTasks}
                </div>
                <p className="text-xs text-gray-500 mt-1">Requires attention</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search clients by name, company, or email..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <select
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filter.status}
                  onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                >
                  <option value="all">All Status</option>
                  <option value="LEAD">Lead</option>
                  <option value="PROSPECT">Prospect</option>
                  <option value="NEGOTIATION">Negotiation</option>
                  <option value="ACTIVE">Active</option>
                  <option value="ON_HOLD">On Hold</option>
                  <option value="COMPLETED">Completed</option>
                </select>
                <select
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filter.category}
                  onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                >
                  <option value="all">All Categories</option>
                  <option value="DIGITAL_MARKETING">Digital Marketing</option>
                  <option value="TRAVEL">Travel</option>
                  <option value="CONSULTING">Consulting</option>
                  <option value="ECOMMERCE">E-commerce</option>
                  <option value="SAAS">SaaS</option>
                  <option value="OTHER">Other</option>
                </select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clients Table */}
        <Card>
          <CardHeader>
            <CardTitle>Clients ({filteredClients.length})</CardTitle>
            <CardDescription>Manage and track all your clients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Client</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Category</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Value</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Health</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Last Contact</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client) => (
                    <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{client.name}</div>
                          {client.company && (
                            <div className="text-sm text-gray-500">{client.company}</div>
                          )}
                          <div className="text-xs text-gray-400">{client.email}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-2xl" title={client.category}>
                          {getCategoryIcon(client.category)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={getStatusColor(client.status)}>
                          {client.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium">{formatCurrency(client.contractValue)}</div>
                        <div className="text-xs text-gray-500">
                          {formatCurrency(client.paidAmount)} paid
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-semibold ${getHealthScoreColor(client.healthScore)}`}>
                          {client.healthScore}%
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {formatDate(client.lastContact)}
                      </td>
                      <td className="py-4 px-4">
                        <Link href={`/clients/${client.id}`}>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredClients.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No clients found</p>
                  <Button className="mt-4" onClick={() => setShowAddClient(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Client
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Add Client Modal - Basic version, will enhance later */}
      {showAddClient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Add New Client</h2>
            <p className="text-gray-600 mb-4">
              Client form will be implemented in the client detail page. For now, you can view the interface.
            </p>
            <Button onClick={() => setShowAddClient(false)}>Close</Button>
          </div>
        </div>
      )}
    </div>
  )
}
