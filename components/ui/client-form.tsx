"use client"

import { useState, useMemo, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'
import { Select } from './select'
import { Textarea } from './textarea'
import { X, HelpCircle, Info, Languages } from 'lucide-react'
import { getStatusDefinition, getPriorityDefinition } from '@/lib/utils'
import { getTranslation, type Language } from '@/lib/translations'

interface ClientFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  initialData?: any
}

export function ClientForm({ open, onOpenChange, onSuccess, initialData }: ClientFormProps) {
  const [loading, setLoading] = useState(false)
  const [lang, setLang] = useState<Language>('en')
  const [showStatusHelp, setShowStatusHelp] = useState(false)
  const [showPriorityHelp, setShowPriorityHelp] = useState(false)

  const t = useCallback((key: any) => getTranslation(lang, key), [lang])

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    company: initialData?.company || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    alternatePhone: initialData?.alternatePhone || '',
    whatsapp: initialData?.whatsapp || '',
    website: initialData?.website || '',

    // Business Details
    category: initialData?.category || 'DIGITAL_MARKETING',
    industry: initialData?.industry || '',
    teamSize: initialData?.teamSize || '',

    // Location
    address: initialData?.address || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    country: initialData?.country || 'India',

    // Lead Information
    leadSource: initialData?.leadSource || '',
    referredBy: initialData?.referredBy || '',

    status: initialData?.status || 'LEAD',
    statusReason: initialData?.statusReason || '',
    priority: initialData?.priority || 'MEDIUM',

    // Financial
    contractValue: initialData?.contractValue || 0,
    paidAmount: initialData?.paidAmount || 0,
    pendingAmount: initialData?.pendingAmount || 0,
    currency: initialData?.currency || 'INR',
    paymentTerms: initialData?.paymentTerms || '',
    nextPaymentDate: initialData?.nextPaymentDate || '',

    // Dates
    nextFollowUp: initialData?.nextFollowUp || '',
    expectedClose: initialData?.expectedClose || '',
    contractStart: initialData?.contractStart || '',
    contractEnd: initialData?.contractEnd || '',

    // Progress & Deliverables
    overallProgress: initialData?.overallProgress || 0,
    completedWork: initialData?.completedWork || '',
    pendingWork: initialData?.pendingWork || '',
    currentMilestone: initialData?.currentMilestone || '',

    // Team Assignment
    accountManager: initialData?.accountManager || '',

    // Communication
    preferredContactMethod: initialData?.preferredContactMethod || '',
    communicationFrequency: initialData?.communicationFrequency || '',
    bestTimeToContact: initialData?.bestTimeToContact || '',

    notes: initialData?.notes || '',
    internalNotes: initialData?.internalNotes || '',
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

  const StatusHelpTooltip = ({ status }: { status: string }) => {
    const def = getStatusDefinition(status)
    return (
      <div className="text-xs bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
        <p className="font-semibold text-blue-900">{def.title}</p>
        <p className="text-blue-700 mt-1">{def.description}</p>
        <p className="text-blue-600 mt-2 italic">{def.when}</p>
      </div>
    )
  }

  const PriorityHelpTooltip = ({ priority }: { priority: string }) => {
    const def = getPriorityDefinition(priority)
    return (
      <div className="text-xs bg-purple-50 border border-purple-200 rounded-lg p-3 mb-2">
        <p className="font-semibold text-purple-900">{def.title}</p>
        <p className="text-purple-700 mt-1">{def.description}</p>
        <p className="text-purple-600 mt-2 italic">{def.when}</p>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto glass border-0 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {initialData ? t('editClient') : t('addClient')}
              </DialogTitle>
              <button
                onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
                className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all shadow-md"
                type="button"
              >
                <Languages className="h-3 w-3" />
                {lang === 'en' ? 'हिंदी' : 'English'}
              </button>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="text-sm text-gray-600">{t('formSubtitle')}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Basic Information */}
          <div className="space-y-4 glass p-5 rounded-xl border-0">
            <h3 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
              {t('basicInfo')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-gray-700 font-medium">{t('fullName')} *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t('phName')}
                  className="bg-white/50 backdrop-blur-sm border-blue-200 focus:ring-blue-500 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="company" className="text-gray-700 font-medium">{t('companyOrg')}</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder={t('phCompany')}
                  className="bg-white/50 backdrop-blur-sm border-blue-200 focus:ring-blue-500 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-gray-700 font-medium">{t('email')} *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={t('phEmail')}
                  className="bg-white/50 backdrop-blur-sm border-blue-200 focus:ring-blue-500 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-gray-700 font-medium">{t('primaryPhone')}</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder={t('phPhone')}
                  className="bg-white/50 backdrop-blur-sm border-blue-200 focus:ring-blue-500 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="alternatePhone" className="text-gray-700 font-medium">{t('alternatePhone')}</Label>
                <Input
                  id="alternatePhone"
                  type="tel"
                  value={formData.alternatePhone}
                  onChange={(e) => setFormData({ ...formData, alternatePhone: e.target.value })}
                  placeholder={t('phPhone')}
                  className="bg-white/50 backdrop-blur-sm border-blue-200 focus:ring-blue-500 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="whatsapp" className="text-gray-700 font-medium">{t('whatsappNumber')}</Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder={t('phPhone')}
                  className="bg-white/50 backdrop-blur-sm border-blue-200 focus:ring-blue-500 mt-1"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="website" className="text-gray-700 font-medium">{t('website')}</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder={t('phWebsite')}
                  className="bg-white/50 backdrop-blur-sm border-blue-200 focus:ring-blue-500 mt-1"
                />
              </div>
            </div>
          </div>

          {/* Business Details */}
          <div className="space-y-4 glass p-5 rounded-xl border-0">
            <h3 className="font-bold text-lg bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
              {t('businessDetails')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="category" className="text-gray-700 font-medium">Service Category *</Label>
                <Select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="bg-white/50 backdrop-blur-sm border-blue-200 focus:ring-blue-500 mt-1"
                >
                  <option value="DIGITAL_MARKETING">📱 Digital Marketing</option>
                  <option value="TRAVEL">✈️ Travel</option>
                  <option value="CONSULTING">💼 Consulting</option>
                  <option value="ECOMMERCE">🛒 E-commerce</option>
                  <option value="SAAS">💻 SaaS</option>
                  <option value="OTHER">📋 Other</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="industry" className="text-gray-700 font-medium">Industry</Label>
                <Input
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  placeholder="Healthcare, Education, Retail..."
                  className="bg-white/50 backdrop-blur-sm border-blue-200 focus:ring-blue-500 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="teamSize" className="text-gray-700 font-medium">Team Size</Label>
                <Select
                  id="teamSize"
                  value={formData.teamSize}
                  onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                  className="bg-white/50 backdrop-blur-sm border-blue-200 focus:ring-blue-500 mt-1"
                >
                  <option value="">Select Size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="500+">500+ employees</option>
                </Select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4 glass p-5 rounded-xl border-0">
            <h3 className="font-bold text-lg bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent flex items-center gap-2">
              📍 Location Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="address" className="text-gray-700 font-medium">Street Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Main Street, Building A"
                  className="bg-white/50 backdrop-blur-sm border-blue-200 focus:ring-blue-500 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="city" className="text-gray-700 font-medium">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Mumbai"
                  className="bg-white/50 backdrop-blur-sm border-blue-200 focus:ring-blue-500 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="state" className="text-gray-700 font-medium">State/Province</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="Maharashtra"
                  className="bg-white/50 backdrop-blur-sm border-blue-200 focus:ring-blue-500 mt-1"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="country" className="text-gray-700 font-medium">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="India"
                  className="bg-white/50 backdrop-blur-sm border-blue-200 focus:ring-blue-500 mt-1"
                />
              </div>
            </div>
          </div>

          {/* Lead Information */}
          <div className="space-y-4 glass p-5 rounded-xl border-0">
            <h3 className="font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
              🎯 Lead Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="leadSource" className="text-gray-700 font-medium">How did they find us?</Label>
                <Select
                  id="leadSource"
                  value={formData.leadSource}
                  onChange={(e) => setFormData({ ...formData, leadSource: e.target.value })}
                  className="bg-white/50 backdrop-blur-sm border-blue-200 focus:ring-blue-500 mt-1"
                >
                  <option value="">Select Source</option>
                  <option value="Website">Website</option>
                  <option value="Referral">Referral</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Cold Outreach">Cold Outreach</option>
                  <option value="Event">Event/Conference</option>
                  <option value="Advertisement">Advertisement</option>
                  <option value="Partner">Partner</option>
                  <option value="Other">Other</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="referredBy" className="text-gray-700 font-medium">Referred By</Label>
                <Input
                  id="referredBy"
                  value={formData.referredBy}
                  onChange={(e) => setFormData({ ...formData, referredBy: e.target.value })}
                  placeholder="Name of person who referred"
                  className="bg-white/50 backdrop-blur-sm border-blue-200 focus:ring-blue-500 mt-1"
                />
              </div>
            </div>
          </div>

          {/* Status & Priority */}
          <div className="space-y-4 glass p-5 rounded-xl border-0">
            <h3 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
              ⚡ Status & Priority
              <Info className="h-4 w-4 text-blue-500 cursor-help" />
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="status" className="text-gray-700 font-medium">Client Status *</Label>
                  <button
                    type="button"
                    onClick={() => setShowStatusHelp(!showStatusHelp)}
                    className="text-blue-600 hover:text-blue-700 text-xs flex items-center gap-1"
                  >
                    <HelpCircle className="h-3 w-3" />
                    Help
                  </button>
                </div>
                {showStatusHelp && <StatusHelpTooltip status={formData.status} />}
                <Select
                  id="status"
                  value={formData.status}
                  onChange={(e) => {
                    setFormData({ ...formData, status: e.target.value })
                    setShowStatusHelp(true)
                  }}
                  className="bg-white/50 backdrop-blur-sm border-blue-200 focus:ring-blue-500 mt-1"
                >
                  <option value="LEAD">🌱 Lead - New inquiry received</option>
                  <option value="PROSPECT">💼 Prospect - Actively engaged</option>
                  <option value="NEGOTIATION">🤝 Negotiation - Discussing terms</option>
                  <option value="ACTIVE">✅ Active - Deal closed, working</option>
                  <option value="ON_HOLD">⏸️ On Hold - Temporarily paused</option>
                  <option value="COMPLETED">🎉 Completed - Project finished</option>
                  <option value="LOST">❌ Lost - Did not close</option>
                </Select>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="priority" className="text-gray-700 font-medium">Priority Level *</Label>
                  <button
                    type="button"
                    onClick={() => setShowPriorityHelp(!showPriorityHelp)}
                    className="text-purple-600 hover:text-purple-700 text-xs flex items-center gap-1"
                  >
                    <HelpCircle className="h-3 w-3" />
                    Help
                  </button>
                </div>
                {showPriorityHelp && <PriorityHelpTooltip priority={formData.priority} />}
                <Select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) => {
                    setFormData({ ...formData, priority: e.target.value })
                    setShowPriorityHelp(true)
                  }}
                  className="bg-white/50 backdrop-blur-sm border-blue-200 focus:ring-blue-500 mt-1"
                >
                  <option value="LOW">🟢 Low - No urgency</option>
                  <option value="MEDIUM">🔵 Medium - Standard timeline</option>
                  <option value="HIGH">🟠 High - Needs prompt attention</option>
                  <option value="URGENT">🔴 Urgent - Immediate action</option>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="statusReason" className="text-gray-700 font-medium">Status Reason/Context</Label>
                <Input
                  id="statusReason"
                  value={formData.statusReason}
                  onChange={(e) => setFormData({ ...formData, statusReason: e.target.value })}
                  placeholder="e.g., 'Waiting for budget approval', 'Client on vacation'"
                  className="bg-white/50 backdrop-blur-sm border-blue-200 focus:ring-blue-500 mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">Explain why the client is in this status</p>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="space-y-4 glass p-5 rounded-xl border-0">
            <h3 className="font-bold text-lg bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent flex items-center gap-2">
              💰 Financial Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="contractValue" className="text-gray-700 font-medium">Total Contract Value</Label>
                <Input
                  id="contractValue"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.contractValue}
                  onChange={(e) => setFormData({ ...formData, contractValue: parseFloat(e.target.value) || 0 })}
                  placeholder="50000"
                  className="bg-white/50 backdrop-blur-sm border-blue-200 focus:ring-blue-500 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="paidAmount" className="text-gray-700 font-medium">Amount Paid</Label>
                <Input
                  id="paidAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.paidAmount}
                  onChange={(e) => setFormData({ ...formData, paidAmount: parseFloat(e.target.value) || 0 })}
                  placeholder="25000"
                  className="bg-white/50 backdrop-blur-sm border-blue-200 focus:ring-blue-500 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="pendingAmount" className="text-gray-700 font-medium">Pending Amount</Label>
                <Input
                  id="pendingAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.pendingAmount}
                  onChange={(e) => setFormData({ ...formData, pendingAmount: parseFloat(e.target.value) || 0 })}
                  placeholder="25000"
                  className="bg-white/50 backdrop-blur-sm border-blue-200 focus:ring-blue-500 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="currency" className="text-gray-700 font-medium">Currency</Label>
                <Select
                  id="currency"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="bg-white/50 backdrop-blur-sm border-blue-200 focus:ring-blue-500 mt-1"
                >
                  <option value="INR">₹ INR (Indian Rupee)</option>
                  <option value="USD">$ USD (US Dollar)</option>
                  <option value="EUR">€ EUR (Euro)</option>
                  <option value="GBP">£ GBP (British Pound)</option>
                  <option value="AUD">$ AUD (Australian Dollar)</option>
                </Select>
              </div>
              <div className="lg:col-span-2">
                <Label htmlFor="paymentTerms" className="text-gray-700 font-medium">Payment Terms</Label>
                <Input
                  id="paymentTerms"
                  value={formData.paymentTerms}
                  onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                  placeholder="e.g., 50% advance, 50% on completion"
                  className="bg-white/50 backdrop-blur-sm border-blue-200 focus:ring-blue-500 mt-1"
                />
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <Label htmlFor="nextPaymentDate" className="text-gray-700 font-medium">Next Payment Due Date</Label>
                <Input
                  id="nextPaymentDate"
                  type="date"
                  value={formData.nextPaymentDate}
                  onChange={(e) => setFormData({ ...formData, nextPaymentDate: e.target.value })}
                  className="bg-white/50 backdrop-blur-sm border-blue-200 focus:ring-blue-500 mt-1"
                />
              </div>
            </div>
          </div>

          {/* Important Dates */}
          <div className="space-y-4 glass p-5 rounded-xl border-0">
            <h3 className="font-bold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
              📅 Important Dates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nextFollowUp" className="text-gray-700 font-medium">Next Follow-Up Date</Label>
                <Input
                  id="nextFollowUp"
                  type="date"
                  value={formData.nextFollowUp}
                  onChange={(e) => setFormData({ ...formData, nextFollowUp: e.target.value })}
                  className="bg-white/50 backdrop-blur-sm border-blue-200 focus:ring-blue-500 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="expectedClose" className="text-gray-700 font-medium">Expected Close Date</Label>
                <Input
                  id="expectedClose"
                  type="date"
                  value={formData.expectedClose}
                  onChange={(e) => setFormData({ ...formData, expectedClose: e.target.value })}
                  className="bg-white/50 backdrop-blur-sm border-blue-200 focus:ring-blue-500 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="contractStart" className="text-gray-700 font-medium">Contract Start Date</Label>
                <Input
                  id="contractStart"
                  type="date"
                  value={formData.contractStart}
                  onChange={(e) => setFormData({ ...formData, contractStart: e.target.value })}
                  className="bg-white/50 backdrop-blur-sm border-blue-200 focus:ring-blue-500 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="contractEnd" className="text-gray-700 font-medium">Contract End Date</Label>
                <Input
                  id="contractEnd"
                  type="date"
                  value={formData.contractEnd}
                  onChange={(e) => setFormData({ ...formData, contractEnd: e.target.value })}
                  className="bg-white/50 backdrop-blur-sm border-blue-200 focus:ring-blue-500 mt-1"
                />
              </div>
            </div>
          </div>

          {/* Progress & Work Status */}
          <div className="space-y-4 glass p-5 rounded-xl border-0">
            <h3 className="font-bold text-lg bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent flex items-center gap-2">
              📊 Progress & Work Status
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="overallProgress" className="text-gray-700 font-medium">Overall Progress (%)</Label>
                <Input
                  id="overallProgress"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.overallProgress}
                  onChange={(e) => setFormData({ ...formData, overallProgress: parseInt(e.target.value) || 0 })}
                  className="bg-white/50 backdrop-blur-sm border-blue-200 focus:ring-blue-500 mt-1"
                />
                <div className="mt-2 w-full bg-gray-200/50 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-green-600 h-2 rounded-full transition-all"
                    style={{ width: `${formData.overallProgress}%` }}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="currentMilestone" className="text-gray-700 font-medium">Current Milestone/Phase</Label>
                <Input
                  id="currentMilestone"
                  value={formData.currentMilestone}
                  onChange={(e) => setFormData({ ...formData, currentMilestone: e.target.value })}
                  placeholder="e.g., Design Phase, Development Sprint 2"
                  className="bg-white/50 backdrop-blur-sm border-blue-200 focus:ring-blue-500 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="completedWork" className="text-gray-700 font-medium">What Has Been Completed?</Label>
                <Textarea
                  id="completedWork"
                  value={formData.completedWork}
                  onChange={(e) => setFormData({ ...formData, completedWork: e.target.value })}
                  placeholder="List all completed deliverables, tasks, and milestones..."
                  rows={3}
                  className="bg-white/50 backdrop-blur-sm border-blue-200 focus:ring-blue-500 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="pendingWork" className="text-gray-700 font-medium">What&apos;s Pending/Remaining?</Label>
                <Textarea
                  id="pendingWork"
                  value={formData.pendingWork}
                  onChange={(e) => setFormData({ ...formData, pendingWork: e.target.value })}
                  placeholder="List all pending tasks, deliverables, and next steps..."
                  rows={3}
                  className="bg-white/50 backdrop-blur-sm border-blue-200 focus:ring-blue-500 mt-1"
                />
              </div>
            </div>
          </div>

          {/* Team & Communication */}
          <div className="space-y-4 glass p-5 rounded-xl border-0">
            <h3 className="font-bold text-lg bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
              👥 Team & Communication Preferences
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="accountManager" className="text-gray-700 font-medium">Account Manager</Label>
                <Input
                  id="accountManager"
                  value={formData.accountManager}
                  onChange={(e) => setFormData({ ...formData, accountManager: e.target.value })}
                  placeholder="Who manages this client?"
                  className="bg-white/50 backdrop-blur-sm border-blue-200 focus:ring-blue-500 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="preferredContactMethod" className="text-gray-700 font-medium">Preferred Contact Method</Label>
                <Select
                  id="preferredContactMethod"
                  value={formData.preferredContactMethod}
                  onChange={(e) => setFormData({ ...formData, preferredContactMethod: e.target.value })}
                  className="bg-white/50 backdrop-blur-sm border-blue-200 focus:ring-blue-500 mt-1"
                >
                  <option value="">Select Method</option>
                  <option value="Email">📧 Email</option>
                  <option value="Phone">📞 Phone Call</option>
                  <option value="WhatsApp">💬 WhatsApp</option>
                  <option value="Meeting">🤝 In-Person Meeting</option>
                  <option value="Video Call">📹 Video Call</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="communicationFrequency" className="text-gray-700 font-medium">Update Frequency</Label>
                <Select
                  id="communicationFrequency"
                  value={formData.communicationFrequency}
                  onChange={(e) => setFormData({ ...formData, communicationFrequency: e.target.value })}
                  className="bg-white/50 backdrop-blur-sm border-blue-200 focus:ring-blue-500 mt-1"
                >
                  <option value="">Select Frequency</option>
                  <option value="Daily">Daily</option>
                  <option value="Every 2-3 Days">Every 2-3 Days</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Bi-weekly">Bi-weekly</option>
                  <option value="Monthly">Monthly</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="bestTimeToContact" className="text-gray-700 font-medium">Best Time to Contact</Label>
                <Select
                  id="bestTimeToContact"
                  value={formData.bestTimeToContact}
                  onChange={(e) => setFormData({ ...formData, bestTimeToContact: e.target.value })}
                  className="bg-white/50 backdrop-blur-sm border-blue-200 focus:ring-blue-500 mt-1"
                >
                  <option value="">Select Time</option>
                  <option value="Morning (9AM-12PM)">🌅 Morning (9AM-12PM)</option>
                  <option value="Afternoon (12PM-5PM)">☀️ Afternoon (12PM-5PM)</option>
                  <option value="Evening (5PM-8PM)">🌆 Evening (5PM-8PM)</option>
                  <option value="Anytime">⏰ Anytime</option>
                </Select>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4 glass p-5 rounded-xl border-0">
            <h3 className="font-bold text-lg bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent flex items-center gap-2">
              📝 Additional Notes
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="notes" className="text-gray-700 font-medium">Client Notes (Shareable)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Add any notes that can be shared with the client or team..."
                  rows={4}
                  className="bg-white/50 backdrop-blur-sm border-blue-200 focus:ring-blue-500 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="internalNotes" className="text-gray-700 font-medium">Internal Notes (Private)</Label>
                <Textarea
                  id="internalNotes"
                  value={formData.internalNotes}
                  onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })}
                  placeholder="Private notes for internal team use only..."
                  rows={4}
                  className="bg-white/50 backdrop-blur-sm border-blue-200 focus:ring-blue-500 mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">🔒 These notes are private and not visible to clients</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-white/90 backdrop-blur-sm p-4 -mx-6 -mb-6 rounded-b-xl">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
            >
              {loading ? t('save') : initialData ? t('updateClient') : t('createClient')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
