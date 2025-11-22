"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ClientForm } from '@/components/ui/client-form'
import { AnalyticsCharts } from '@/components/ui/analytics-charts'
import { formatCurrency, formatDate, getStatusColor, getCategoryIcon, getHealthScoreColor } from '@/lib/utils'
import {
  Plus, TrendingUp, Users, DollarSign, CheckCircle, AlertCircle,
  Calendar, Search, Download, BarChart3, RefreshCw
} from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ status: 'all', category: 'all' })
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddClient, setShowAddClient] = useState(false)
  const [showCharts, setShowCharts] = useState(false)

  useEffect(() => {
    fetchData()
  }, [filter])

  const fetchData = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filter.status !== 'all') params.append('status', filter.status)
      if (filter.category !== 'all') params.append('category', filter.category)

      const [analyticsRes, clientsRes] = await Promise.all([
        fetch('/api/analytics'),
        fetch(`/api/clients?${params.toString()}`)
      ])

      const [analyticsData, clientsData] = await Promise.all([
        analyticsRes.json(),
        clientsRes.json()
      ])

      setAnalytics(analyticsData)
      setClients(Array.isArray(clientsData) ? clientsData : [])
    } catch (error) {
      console.error('Error fetching data:', error)
      setClients([])
      setAnalytics(null)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (format: string) => {
    try {
      const params = new URLSearchParams()
      params.append('format', format)
      if (filter.status !== 'all') params.append('status', filter.status)
      if (filter.category !== 'all') params.append('category', filter.category)

      const res = await fetch(`/api/export?${params.toString()}`)

      if (format === 'csv') {
        const blob = await res.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `clients-export-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
      } else {
        const data = await res.json()
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `clients-export-${new Date().toISOString().split('T')[0]}.json`
        a.click()
      }
    } catch (error) {
      console.error('Error exporting:', error)
      alert('Failed to export data')
    }
  }

  const filteredClients = Array.isArray(clients) ? clients.filter(client =>
    searchQuery === '' ||
    client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchQuery.toLowerCase())
  ) : []

  if (loading && !analytics) {
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
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass sticky top-0 z-10 shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="fade-in">
              <h1 className="text-3xl font-bold gradient-text">
                Client Management System
              </h1>
              <p className="text-sm text-gray-600 mt-1">Advanced dashboard for managing all your clients</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
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
        {analytics && analytics.overview && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="glass card-hover glow fade-in stagger-1 border-0 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full blur-2xl"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Total Clients</CardTitle>
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent count-up">
                    {analytics.overview.totalClients || 0}
                  </div>
                  <p className="text-xs text-green-600 mt-2 flex items-center font-medium">
                    <TrendingUp className="inline h-3 w-3 mr-1" />
                    {analytics.overview.activeClients || 0} active
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {analytics.overview.leadsCount || 0} leads in pipeline
                  </p>
                </CardContent>
              </Card>

              <Card className="glass card-hover glow fade-in stagger-2 border-0 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-green-600/20 rounded-full blur-2xl"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Total Revenue</CardTitle>
                  <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-lg">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent count-up">
                    {formatCurrency(analytics.overview.totalRevenue || 0)}
                  </div>
                  <p className="text-xs text-gray-600 mt-2 font-medium">
                    {formatCurrency(analytics.overview.paidRevenue || 0)} paid
                  </p>
                  <p className="text-xs text-orange-600 mt-1 font-medium">
                    {formatCurrency(analytics.overview.pendingRevenue || 0)} pending
                  </p>
                </CardContent>
              </Card>

              <Card className="glass card-hover glow fade-in stagger-3 border-0 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-purple-600/20 rounded-full blur-2xl"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Tasks</CardTitle>
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl shadow-lg">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent count-up">
                    {analytics.overview.totalTasks || 0}
                  </div>
                  <p className="text-xs text-gray-600 mt-2 font-medium">
                    {analytics.overview.completedTasks || 0} completed
                  </p>
                  <div className="mt-2 w-full bg-gray-200/50 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${(analytics.overview.totalTasks || 0) > 0
                          ? ((analytics.overview.completedTasks || 0) / (analytics.overview.totalTasks || 1)) * 100
                          : 0}%`
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass card-hover fade-in stagger-4 border-0 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-400/20 to-red-600/20 rounded-full blur-2xl"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Overdue Tasks</CardTitle>
                  <div className="bg-gradient-to-br from-red-500 to-red-600 p-3 rounded-xl shadow-lg pulse-slow">
                    <AlertCircle className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent count-up">
                    {analytics.overview.overdueTasks || 0}
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Requires immediate attention</p>
                  {(analytics.overview.overdueTasks || 0) > 0 && (
                    <p className="text-xs text-red-600 mt-2 font-bold animate-pulse">⚠️ Action needed!</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="mb-8 fade-in">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Analytics & Insights
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCharts(!showCharts)}
                  className="glass border-white/20 hover:shadow-lg transition-all"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  {showCharts ? 'Hide Charts' : 'Show Charts'}
                </Button>
              </div>
              {showCharts && <div className="scale-in"><AnalyticsCharts data={analytics} /></div>}
            </div>
          </>
        )}

        {/* Filters and Search */}
        <Card className="mb-6 glass border-0 shadow-lg fade-in">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500" />
                <input
                  type="text"
                  placeholder="Search clients by name, company, or email..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white/50 backdrop-blur-sm border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <select
                  className="px-4 py-2.5 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50 backdrop-blur-sm shadow-sm transition-all hover:shadow-md"
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
                  <option value="LOST">Lost</option>
                </select>
                <select
                  className="px-4 py-2.5 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50 backdrop-blur-sm shadow-sm transition-all hover:shadow-md"
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
                <div className="relative">
                  <Button variant="outline" onClick={() => {
                    const menu = document.getElementById('export-menu')
                    if (menu) menu.classList.toggle('hidden')
                  }}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <div
                    id="export-menu"
                    className="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10"
                  >
                    <button
                      onClick={() => handleExport('csv')}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Export as CSV
                    </button>
                    <button
                      onClick={() => handleExport('json')}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Export as JSON
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clients Table */}
        <Card className="glass border-0 shadow-xl fade-in">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Clients ({filteredClients.length})
                </CardTitle>
                <CardDescription className="text-gray-600">Manage and track all your clients</CardDescription>
              </div>
              {filteredClients.length > 0 && (
                <div className="text-sm text-gray-500">
                  Showing {filteredClients.length} of {clients.length} clients
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
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
                  {filteredClients.map((client, index) => (
                    <tr key={client.id} className="border-b border-gray-100/50 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-300 fade-in" style={{animationDelay: `${index * 0.05}s`}}>
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
                        <div className="text-xs text-green-600">
                          {formatCurrency(client.paidAmount)} paid
                        </div>
                        {client.contractValue - client.paidAmount > 0 && (
                          <div className="text-xs text-orange-600">
                            {formatCurrency(client.contractValue - client.paidAmount)} pending
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getHealthScoreColor(client.healthScore)}`}>
                          {client.healthScore}%
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {formatDate(client.lastContact)}
                        <div className="text-xs text-gray-400 mt-1">
                          {Math.floor((new Date().getTime() - new Date(client.lastContact).getTime()) / (1000 * 60 * 60 * 24))} days ago
                        </div>
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
                  <p className="text-gray-500 mb-2">
                    {searchQuery || filter.status !== 'all' || filter.category !== 'all'
                      ? 'No clients found matching your filters'
                      : 'No clients yet'}
                  </p>
                  <Button className="mt-4" onClick={() => setShowAddClient(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Client
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        {analytics?.recentActivities && Array.isArray(analytics.recentActivities) && analytics.recentActivities.length > 0 && (
          <Card className="mt-6 glass border-0 shadow-xl fade-in">
            <CardHeader>
              <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Recent Activity
              </CardTitle>
              <CardDescription className="text-gray-600">Latest updates across all clients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.recentActivities.slice(0, 5).map((activity: any, index: number) => (
                  <div key={activity.id} className="flex items-start gap-3 p-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300 scale-in border border-gray-100/50" style={{animationDelay: `${index * 0.1}s`}}>
                    <div className="flex-shrink-0 w-3 h-3 mt-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-700 font-medium">{activity.client?.name || 'Unknown'}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(activity.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Add Client Modal */}
      <ClientForm
        open={showAddClient}
        onOpenChange={setShowAddClient}
        onSuccess={fetchData}
      />
    </div>
  )
}
