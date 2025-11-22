"use client"

import React from 'react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

interface AnalyticsChartsProps {
  data: any
}

export function AnalyticsCharts({ data }: AnalyticsChartsProps) {
  if (!data) return null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Client Distribution by Status */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="font-semibold text-lg mb-4">Clients by Status</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data.clientsByStatus}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={(entry) => `${entry.status}: ${entry.count}`}
            >
              {data.clientsByStatus?.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Client Distribution by Category */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="font-semibold text-lg mb-4">Clients by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.clientsByCategory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Revenue Trend */}
      {data.monthlyRevenue && data.monthlyRevenue.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 lg:col-span-2">
          <h3 className="font-semibold text-lg mb-4">Revenue Trend (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="Total Revenue" />
              <Line type="monotone" dataKey="paid" stroke="#10b981" strokeWidth={2} name="Paid Amount" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
