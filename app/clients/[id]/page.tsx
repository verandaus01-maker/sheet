"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate, formatDateTime, getStatusColor, getCategoryIcon } from '@/lib/utils'
import {
  ArrowLeft, Save, Plus, CheckCircle, Clock, AlertCircle,
  Phone, Mail, Building, Calendar, DollarSign, Activity, FileText, Trash2
} from 'lucide-react'

export default function ClientDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [client, setClient] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'MEDIUM', dueDate: '' })
  const [newActivity, setNewActivity] = useState({ type: 'NOTE', title: '', description: '' })

  useEffect(() => {
    if (params.id) {
      fetchClient()
    }
  }, [params.id])

  const fetchClient = async () => {
    try {
      const res = await fetch(`/api/clients/${params.id}`)
      const data = await res.json()
      setClient(data)
    } catch (error) {
      console.error('Error fetching client:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/clients/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(client),
      })
      if (res.ok) {
        alert('Client updated successfully!')
        fetchClient()
      }
    } catch (error) {
      console.error('Error updating client:', error)
      alert('Failed to update client')
    } finally {
      setSaving(false)
    }
  }

  const handleAddTask = async () => {
    if (!newTask.title) {
      alert('Please enter a task title')
      return
    }

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTask,
          clientId: params.id,
        }),
      })

      if (res.ok) {
        setNewTask({ title: '', description: '', priority: 'MEDIUM', dueDate: '' })
        fetchClient()
      }
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  const handleUpdateTask = async (taskId: string, updates: any) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (res.ok) {
        fetchClient()
      }
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const handleAddActivity = async () => {
    if (!newActivity.title) {
      alert('Please enter an activity title')
      return
    }

    try {
      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newActivity,
          clientId: params.id,
        }),
      })

      if (res.ok) {
        setNewActivity({ type: 'NOTE', title: '', description: '' })
        fetchClient()
      }
    } catch (error) {
      console.error('Error creating activity:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Client not found</h2>
          <Button onClick={() => router.push('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const pendingTasks = client.tasks?.filter((t: any) => t.status !== 'COMPLETED') || []
  const completedTasks = client.tasks?.filter((t: any) => t.status === 'COMPLETED') || []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.push('/')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{getCategoryIcon(client.category)}</span>
                  <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
                  <Badge className={getStatusColor(client.status)}>{client.status}</Badge>
                </div>
                <p className="text-sm text-gray-500 mt-1">{client.company || client.email}</p>
              </div>
            </div>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {['overview', 'tasks', 'activity', 'details'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium capitalize ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">Contract Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{formatCurrency(client.contractValue)}</div>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatCurrency(client.paidAmount)} paid
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">Health Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{client.healthScore}%</div>
                    <p className="text-sm text-gray-500 mt-1">
                      {client.healthScore >= 75 ? 'Excellent' : client.healthScore >= 50 ? 'Good' : 'Needs Attention'}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Pending Tasks */}
              <Card>
                <CardHeader>
                  <CardTitle>Pending Tasks ({pendingTasks.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pendingTasks.slice(0, 5).map((task: any) => (
                      <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3 flex-1">
                          <button
                            onClick={() => handleUpdateTask(task.id, { status: 'COMPLETED' })}
                            className="text-gray-400 hover:text-green-600"
                          >
                            <CheckCircle className="h-5 w-5" />
                          </button>
                          <div className="flex-1">
                            <div className="font-medium">{task.title}</div>
                            {task.description && (
                              <div className="text-sm text-gray-500">{task.description}</div>
                            )}
                          </div>
                        </div>
                        {task.dueDate && (
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(task.dueDate)}
                          </div>
                        )}
                      </div>
                    ))}
                    {pendingTasks.length === 0 && (
                      <p className="text-center text-gray-500 py-4">No pending tasks</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {client.activities?.slice(0, 10).map((activity: any) => (
                      <div key={activity.id} className="flex gap-3 pb-3 border-b border-gray-100 last:border-0">
                        <div className="flex-shrink-0">
                          <Activity className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{activity.title}</p>
                          {activity.description && (
                            <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">{formatDateTime(activity.createdAt)}</p>
                        </div>
                      </div>
                    ))}
                    {(!client.activities || client.activities.length === 0) && (
                      <p className="text-center text-gray-500 py-4">No activities yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <a href={`mailto:${client.email}`} className="text-blue-600 hover:underline">
                      {client.email}
                    </a>
                  </div>
                  {client.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <a href={`tel:${client.phone}`} className="text-blue-600 hover:underline">
                        {client.phone}
                      </a>
                    </div>
                  )}
                  {client.company && (
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="h-4 w-4 text-gray-400" />
                      <span>{client.company}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Add Task */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Add Task</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input
                    placeholder="Task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  />
                  <Textarea
                    placeholder="Description (optional)"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    rows={2}
                  />
                  <Input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                  <Select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  >
                    <option value="LOW">Low Priority</option>
                    <option value="MEDIUM">Medium Priority</option>
                    <option value="HIGH">High Priority</option>
                    <option value="URGENT">Urgent</option>
                  </Select>
                  <Button onClick={handleAddTask} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Add Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Log Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Select
                    value={newActivity.type}
                    onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
                  >
                    <option value="NOTE">Note</option>
                    <option value="EMAIL">Email</option>
                    <option value="CALL">Call</option>
                    <option value="MEETING">Meeting</option>
                  </Select>
                  <Input
                    placeholder="Activity title"
                    value={newActivity.title}
                    onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                  />
                  <Textarea
                    placeholder="Description"
                    value={newActivity.description}
                    onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                    rows={3}
                  />
                  <Button onClick={handleAddActivity} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Log Activity
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Pending ({pendingTasks.length})</h3>
                  {pendingTasks.map((task: any) => (
                    <div key={task.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start gap-3 flex-1">
                        <button
                          onClick={() => handleUpdateTask(task.id, { status: 'COMPLETED' })}
                          className="mt-1 text-gray-400 hover:text-green-600"
                        >
                          <CheckCircle className="h-5 w-5" />
                        </button>
                        <div className="flex-1">
                          <div className="font-medium">{task.title}</div>
                          {task.description && (
                            <div className="text-sm text-gray-600 mt-1">{task.description}</div>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span className={`px-2 py-1 rounded ${
                              task.priority === 'URGENT' ? 'bg-red-100 text-red-800' :
                              task.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                              task.priority === 'MEDIUM' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {task.priority}
                            </span>
                            {task.dueDate && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(task.dueDate)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <h3 className="font-semibold text-lg mt-8">Completed ({completedTasks.length})</h3>
                  {completedTasks.map((task: any) => (
                    <div key={task.id} className="flex items-start gap-3 p-4 bg-green-50 rounded-lg opacity-60">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                      <div className="flex-1">
                        <div className="font-medium line-through">{task.title}</div>
                        {task.completedAt && (
                          <div className="text-xs text-gray-500 mt-1">
                            Completed {formatDate(task.completedAt)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {client.activities?.map((activity: any, index: number) => (
                  <div key={activity.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Activity className="h-5 w-5 text-blue-600" />
                      </div>
                      {index < client.activities.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{activity.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                          <p className="text-xs text-gray-400 mt-2">{formatDateTime(activity.createdAt)}</p>
                        </div>
                        <Badge>{activity.type}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Details Tab */}
        {activeTab === 'details' && (
          <Card>
            <CardHeader>
              <CardTitle>Client Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={client.name}
                      onChange={(e) => setClient({ ...client, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Company</Label>
                    <Input
                      value={client.company || ''}
                      onChange={(e) => setClient({ ...client, company: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={client.email}
                      onChange={(e) => setClient({ ...client, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={client.phone || ''}
                      onChange={(e) => setClient({ ...client, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select
                      value={client.category}
                      onChange={(e) => setClient({ ...client, category: e.target.value })}
                    >
                      <option value="DIGITAL_MARKETING">Digital Marketing</option>
                      <option value="TRAVEL">Travel</option>
                      <option value="CONSULTING">Consulting</option>
                      <option value="ECOMMERCE">E-commerce</option>
                      <option value="SAAS">SaaS</option>
                      <option value="OTHER">Other</option>
                    </Select>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select
                      value={client.status}
                      onChange={(e) => setClient({ ...client, status: e.target.value })}
                    >
                      <option value="LEAD">Lead</option>
                      <option value="PROSPECT">Prospect</option>
                      <option value="NEGOTIATION">Negotiation</option>
                      <option value="ACTIVE">Active</option>
                      <option value="ON_HOLD">On Hold</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="LOST">Lost</option>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Contract Value</Label>
                    <Input
                      type="number"
                      value={client.contractValue}
                      onChange={(e) => setClient({ ...client, contractValue: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>Paid Amount</Label>
                    <Input
                      type="number"
                      value={client.paidAmount}
                      onChange={(e) => setClient({ ...client, paidAmount: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>Currency</Label>
                    <Input
                      value={client.currency}
                      onChange={(e) => setClient({ ...client, currency: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Expected Close Date</Label>
                    <Input
                      type="date"
                      value={client.expectedClose ? new Date(client.expectedClose).toISOString().split('T')[0] : ''}
                      onChange={(e) => setClient({ ...client, expectedClose: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <Select
                      value={client.priority}
                      onChange={(e) => setClient({ ...client, priority: e.target.value })}
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </Select>
                  </div>
                  <div>
                    <Label>Notes</Label>
                    <Textarea
                      value={client.notes || ''}
                      onChange={(e) => setClient({ ...client, notes: e.target.value })}
                      rows={5}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
