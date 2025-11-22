"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'
import { Select } from './select'
import { Textarea } from './textarea'
import { X } from 'lucide-react'

interface ClientFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  initialData?: any
}

export function ClientForm({ open, onOpenChange, onSuccess, initialData }: ClientFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    company: initialData?.company || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    category: initialData?.category || 'DIGITAL_MARKETING',
    status: initialData?.status || 'LEAD',
    contractValue: initialData?.contractValue || 0,
    paidAmount: initialData?.paidAmount || 0,
    currency: initialData?.currency || 'USD',
    priority: initialData?.priority || 'MEDIUM',
    expectedClose: initialData?.expectedClose || '',
    contractStart: initialData?.contractStart || '',
    contractEnd: initialData?.contractEnd || '',
    notes: initialData?.notes || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = initialData ? `/api/clients/${initialData.id}` : '/api/clients'
      const method = initialData ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        onOpenChange(false)
        if (onSuccess) onSuccess()
        // Reset form
        setFormData({
          name: '',
          company: '',
          email: '',
          phone: '',
          category: 'DIGITAL_MARKETING',
          status: 'LEAD',
          contractValue: 0,
          paidAmount: 0,
          currency: 'USD',
          priority: 'MEDIUM',
          expectedClose: '',
          contractStart: '',
          contractEnd: '',
          notes: '',
        })
      } else {
        alert('Failed to save client')
      }
    } catch (error) {
      console.error('Error saving client:', error)
      alert('Failed to save client')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{initialData ? 'Edit Client' : 'Add New Client'}</DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Acme Corporation"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1-555-0123"
                />
              </div>
            </div>
          </div>

          {/* Classification */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Classification</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                <Label htmlFor="status">Status *</Label>
                <Select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
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
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </Select>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Financial Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="contractValue">Contract Value</Label>
                <Input
                  id="contractValue"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.contractValue}
                  onChange={(e) => setFormData({ ...formData, contractValue: parseFloat(e.target.value) || 0 })}
                  placeholder="50000"
                />
              </div>
              <div>
                <Label htmlFor="paidAmount">Paid Amount</Label>
                <Input
                  id="paidAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.paidAmount}
                  onChange={(e) => setFormData({ ...formData, paidAmount: parseFloat(e.target.value) || 0 })}
                  placeholder="25000"
                />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select
                  id="currency"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="AUD">AUD ($)</option>
                  <option value="CAD">CAD ($)</option>
                </Select>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Important Dates</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="expectedClose">Expected Close Date</Label>
                <Input
                  id="expectedClose"
                  type="date"
                  value={formData.expectedClose}
                  onChange={(e) => setFormData({ ...formData, expectedClose: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="contractStart">Contract Start Date</Label>
                <Input
                  id="contractStart"
                  type="date"
                  value={formData.contractStart}
                  onChange={(e) => setFormData({ ...formData, contractStart: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="contractEnd">Contract End Date</Label>
                <Input
                  id="contractEnd"
                  type="date"
                  value={formData.contractEnd}
                  onChange={(e) => setFormData({ ...formData, contractEnd: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Additional Notes</h3>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add any additional notes or important information about this client..."
                rows={4}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : initialData ? 'Update Client' : 'Create Client'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
