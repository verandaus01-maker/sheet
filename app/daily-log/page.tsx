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
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass sticky top-0 z-10 shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 fade-in">
              <Button variant="ghost" onClick={() => router.push('/')} className="hover:bg-white/50">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold gradient-text">Daily Log</h1>
                <p className="text-sm text-gray-600">Track your daily activities and metrics</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* New Log Entry */}
          <Card className="glass border-0 shadow-xl card-hover fade-in stagger-1 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
            <CardHeader>
              <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                New Daily Log Entry
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-700 font-medium">Date</Label>
                <Input
                  type="date"
                  value={currentLog.date}
                  onChange={(e) => setCurrentLog({ ...currentLog, date: e.target.value })}
                  className="bg-white/50 backdrop-blur-sm border-blue-200 focus:ring-blue-500 mt-1"
                />
              </div>

              <div>
                <Label className="text-gray-700 font-medium">Daily Notes</Label>
                <Textarea
                  placeholder="What did you accomplish today? Any insights or challenges?"
                  value={currentLog.notes}
                  onChange={(e) => setCurrentLog({ ...currentLog, notes: e.target.value })}
                  rows={6}
                  className="bg-white/50 backdrop-blur-sm border-blue-200 focus:ring-blue-500 mt-1"
                />
              </div>

              <div className="border-t border-gray-200/50 pt-4">
                <h3 className="font-bold mb-3 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  Daily Metrics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-700 font-medium">Calls Made</Label>
                    <Input
                      type="number"
                      value={currentLog.metrics.callsMade}
                      onChange={(e) => setCurrentLog({
                        ...currentLog,
                        metrics: { ...currentLog.metrics, callsMade: parseInt(e.target.value) || 0 }
                      })}
                      className="bg-white/50 backdrop-blur-sm border-blue-200 focus:ring-blue-500 mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700 font-medium">Emails Sent</Label>
                    <Input
                      type="number"
                      value={currentLog.metrics.emailsSent}
                      onChange={(e) => setCurrentLog({
                        ...currentLog,
                        metrics: { ...currentLog.metrics, emailsSent: parseInt(e.target.value) || 0 }
                      })}
                      className="bg-white/50 backdrop-blur-sm border-blue-200 focus:ring-blue-500 mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700 font-medium">Meetings Held</Label>
                    <Input
                      type="number"
                      value={currentLog.metrics.meetingsHeld}
                      onChange={(e) => setCurrentLog({
                        ...currentLog,
                        metrics: { ...currentLog.metrics, meetingsHeld: parseInt(e.target.value) || 0 }
                      })}
                      className="bg-white/50 backdrop-blur-sm border-blue-200 focus:ring-blue-500 mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700 font-medium">Tasks Completed</Label>
                    <Input
                      type="number"
                      value={currentLog.metrics.tasksCompleted}
                      onChange={(e) => setCurrentLog({
                        ...currentLog,
                        metrics: { ...currentLog.metrics, tasksCompleted: parseInt(e.target.value) || 0 }
                      })}
                      className="bg-white/50 backdrop-blur-sm border-blue-200 focus:ring-blue-500 mt-1"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-gray-700 font-medium">Revenue Generated ($)</Label>
                    <Input
                      type="number"
                      value={currentLog.metrics.revenue}
                      onChange={(e) => setCurrentLog({
                        ...currentLog,
                        metrics: { ...currentLog.metrics, revenue: parseFloat(e.target.value) || 0 }
                      })}
                      className="bg-white/50 backdrop-blur-sm border-blue-200 focus:ring-blue-500 mt-1"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Daily Log'}
              </Button>
            </CardContent>
          </Card>

          {/* Previous Logs */}
          <div>
            <Card className="glass border-0 shadow-xl card-hover fade-in stagger-2 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
              <CardHeader>
                <CardTitle className="text-xl bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  Previous Logs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                  {logs.map((log: any, index: number) => {
                    const metrics = log.metrics ? JSON.parse(log.metrics) : null
                    return (
                      <div
                        key={log.id}
                        className="p-4 bg-gradient-to-br from-white/80 to-blue-50/30 backdrop-blur-sm rounded-xl border border-blue-100/50 hover:shadow-lg transition-all duration-300 scale-in"
                        style={{animationDelay: `${index * 0.1}s`}}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            {formatDate(log.date)}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-3 whitespace-pre-wrap leading-relaxed">{log.notes}</p>
                        {metrics && (
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            {metrics.callsMade > 0 && (
                              <div className="bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-blue-100 shadow-sm">
                                <span className="text-gray-600">Calls:</span> <span className="font-bold text-blue-600">{metrics.callsMade}</span>
                              </div>
                            )}
                            {metrics.emailsSent > 0 && (
                              <div className="bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-blue-100 shadow-sm">
                                <span className="text-gray-600">Emails:</span> <span className="font-bold text-purple-600">{metrics.emailsSent}</span>
                              </div>
                            )}
                            {metrics.meetingsHeld > 0 && (
                              <div className="bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-blue-100 shadow-sm">
                                <span className="text-gray-600">Meetings:</span> <span className="font-bold text-indigo-600">{metrics.meetingsHeld}</span>
                              </div>
                            )}
                            {metrics.tasksCompleted > 0 && (
                              <div className="bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-blue-100 shadow-sm">
                                <span className="text-gray-600">Tasks:</span> <span className="font-bold text-emerald-600">{metrics.tasksCompleted}</span>
                              </div>
                            )}
                            {metrics.revenue > 0 && (
                              <div className="bg-gradient-to-r from-emerald-50 to-green-50 backdrop-blur-sm px-3 py-2 rounded-lg border border-emerald-200 shadow-sm col-span-2">
                                <span className="text-gray-600">Revenue:</span> <span className="font-bold text-emerald-700">${metrics.revenue.toLocaleString()}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                  {logs.length === 0 && !loading && (
                    <div className="text-center py-12 fade-in">
                      <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600 font-medium">No logs yet</p>
                      <p className="text-gray-500 text-sm mt-1">Start by creating your first entry!</p>
                    </div>
                  )}
                  {loading && (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-4 text-gray-600 text-sm">Loading logs...</p>
                    </div>
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
