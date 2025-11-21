"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatDate } from '@/lib/utils'
import { ArrowLeft, Save, Plus, Calendar } from 'lucide-react'

export default function DailyLogPage() {
  const router = useRouter()
  const [logs, setLogs] = useState<any[]>([])
  const [currentLog, setCurrentLog] = useState({
    date: new Date().toISOString().split('T')[0],
    notes: '',
    metrics: {
      callsMade: 0,
      emailsSent: 0,
      meetingsHeld: 0,
      tasksCompleted: 0,
      revenue: 0,
    }
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/daily-logs')
      const data = await res.json()
      setLogs(data)
    } catch (error) {
      console.error('Error fetching logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/daily-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentLog),
      })

      if (res.ok) {
        alert('Daily log saved successfully!')
        fetchLogs()
        setCurrentLog({
          date: new Date().toISOString().split('T')[0],
          notes: '',
          metrics: {
            callsMade: 0,
            emailsSent: 0,
            meetingsHeld: 0,
            tasksCompleted: 0,
            revenue: 0,
          }
        })
      }
    } catch (error) {
      console.error('Error saving log:', error)
      alert('Failed to save log')
    } finally {
      setSaving(false)
    }
  }

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
                <h1 className="text-2xl font-bold text-gray-900">Daily Log</h1>
                <p className="text-sm text-gray-500">Track your daily activities and metrics</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* New Log Entry */}
          <Card>
            <CardHeader>
              <CardTitle>New Daily Log Entry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={currentLog.date}
                  onChange={(e) => setCurrentLog({ ...currentLog, date: e.target.value })}
                />
              </div>

              <div>
                <Label>Daily Notes</Label>
                <Textarea
                  placeholder="What did you accomplish today? Any insights or challenges?"
                  value={currentLog.notes}
                  onChange={(e) => setCurrentLog({ ...currentLog, notes: e.target.value })}
                  rows={6}
                />
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Daily Metrics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Calls Made</Label>
                    <Input
                      type="number"
                      value={currentLog.metrics.callsMade}
                      onChange={(e) => setCurrentLog({
                        ...currentLog,
                        metrics: { ...currentLog.metrics, callsMade: parseInt(e.target.value) || 0 }
                      })}
                    />
                  </div>
                  <div>
                    <Label>Emails Sent</Label>
                    <Input
                      type="number"
                      value={currentLog.metrics.emailsSent}
                      onChange={(e) => setCurrentLog({
                        ...currentLog,
                        metrics: { ...currentLog.metrics, emailsSent: parseInt(e.target.value) || 0 }
                      })}
                    />
                  </div>
                  <div>
                    <Label>Meetings Held</Label>
                    <Input
                      type="number"
                      value={currentLog.metrics.meetingsHeld}
                      onChange={(e) => setCurrentLog({
                        ...currentLog,
                        metrics: { ...currentLog.metrics, meetingsHeld: parseInt(e.target.value) || 0 }
                      })}
                    />
                  </div>
                  <div>
                    <Label>Tasks Completed</Label>
                    <Input
                      type="number"
                      value={currentLog.metrics.tasksCompleted}
                      onChange={(e) => setCurrentLog({
                        ...currentLog,
                        metrics: { ...currentLog.metrics, tasksCompleted: parseInt(e.target.value) || 0 }
                      })}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Revenue Generated</Label>
                    <Input
                      type="number"
                      value={currentLog.metrics.revenue}
                      onChange={(e) => setCurrentLog({
                        ...currentLog,
                        metrics: { ...currentLog.metrics, revenue: parseFloat(e.target.value) || 0 }
                      })}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSave} disabled={saving} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Daily Log'}
              </Button>
            </CardContent>
          </Card>

          {/* Previous Logs */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Previous Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {logs.map((log: any) => {
                    const metrics = log.metrics ? JSON.parse(log.metrics) : null
                    return (
                      <div key={log.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 text-sm font-semibold">
                            <Calendar className="h-4 w-4" />
                            {formatDate(log.date)}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-3 whitespace-pre-wrap">{log.notes}</p>
                        {metrics && (
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            {metrics.callsMade > 0 && (
                              <div className="bg-white px-2 py-1 rounded">
                                <span className="text-gray-500">Calls:</span> <span className="font-semibold">{metrics.callsMade}</span>
                              </div>
                            )}
                            {metrics.emailsSent > 0 && (
                              <div className="bg-white px-2 py-1 rounded">
                                <span className="text-gray-500">Emails:</span> <span className="font-semibold">{metrics.emailsSent}</span>
                              </div>
                            )}
                            {metrics.meetingsHeld > 0 && (
                              <div className="bg-white px-2 py-1 rounded">
                                <span className="text-gray-500">Meetings:</span> <span className="font-semibold">{metrics.meetingsHeld}</span>
                              </div>
                            )}
                            {metrics.tasksCompleted > 0 && (
                              <div className="bg-white px-2 py-1 rounded">
                                <span className="text-gray-500">Tasks:</span> <span className="font-semibold">{metrics.tasksCompleted}</span>
                              </div>
                            )}
                            {metrics.revenue > 0 && (
                              <div className="bg-white px-2 py-1 rounded col-span-2">
                                <span className="text-gray-500">Revenue:</span> <span className="font-semibold">${metrics.revenue}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                  {logs.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No logs yet. Start by creating your first entry!</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
