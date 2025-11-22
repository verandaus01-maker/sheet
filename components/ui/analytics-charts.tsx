"use client"

import React from 'react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

interface AnalyticsChartsProps {
  data: any
}

export function AnalyticsCharts({ data }: AnalyticsChartsProps) {
  if (!data) return null

  const clientsByStatus = Array.isArray(data.clientsByStatus) ? data.clientsByStatus : []
  const clientsByCategory = Array.isArray(data.clientsByCategory) ? data.clientsByCategory : []
  const monthlyRevenue = Array.isArray(data.monthlyRevenue) ? data.monthlyRevenue : []

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Client Distribution by Status */}
      <div className="glass p-6 rounded-2xl shadow-lg border-0 card-hover overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl"></div>
        <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Clients by Status
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={clientsByStatus}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={(entry) => `${entry.status}: ${entry.count}`}
              animationDuration={800}
            >
              {clientsByStatus.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Client Distribution by Category */}
      <div className="glass p-6 rounded-2xl shadow-lg border-0 card-hover overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/10 to-blue-600/10 rounded-full blur-3xl"></div>
        <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Clients by Category
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={clientsByCategory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar dataKey="count" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} animationDuration={800} />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Revenue Trend */}
      {monthlyRevenue.length > 0 && (
        <div className="glass p-6 rounded-2xl shadow-lg border-0 lg:col-span-2 card-hover overflow-hidden relative">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-400/10 to-blue-600/10 rounded-full blur-3xl"></div>
          <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            Revenue Trend (Last 6 Months)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                formatter={(value) => `$${value.toLocaleString()}`}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={3}
                name="Total Revenue"
                dot={{ fill: '#3b82f6', r: 5 }}
                activeDot={{ r: 7 }}
                animationDuration={800}
              />
              <Line
                type="monotone"
                dataKey="paid"
                stroke="#10b981"
                strokeWidth={3}
                name="Paid Amount"
                dot={{ fill: '#10b981', r: 5 }}
                activeDot={{ r: 7 }}
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
