'use client'

import { ToolCard } from '../ToolCard'
import { getAllVendors } from '@/lib/pricing'
import type { AuditFormValues, ToolFormEntry } from '@/types/form'
import { cn } from '@/lib/utils'

interface StepThreeProps {
  values: Partial<AuditFormValues>
  onChange: (partial: Partial<AuditFormValues>) => void
  errors: Partial<Record<string, string>>
}

export function StepThree({ values, onChange, errors }: StepThreeProps) {
  const vendors = getAllVendors()
  const tools = values.tools ?? []

  const addTool = (vendorId: string) => {
    if (tools.some((t) => t.vendorId === vendorId)) return
    const vendor = vendors.find((v) => v.id === vendorId)
    if (!vendor) return
    const defaultPlan = vendor.plans[0]
    const newEntry: ToolFormEntry = {
      vendorId,
      planName: defaultPlan.planName,
      seats: 1,
      monthlySpend: defaultPlan.monthlyPricePerSeat,
    }
    onChange({ tools: [...tools, newEntry] })
  }

  const removeTool = (index: number) => {
    const updated = tools.filter((_, i) => i !== index)
    onChange({ tools: updated })
  }

  const updateTool = (
    index: number,
    field: keyof ToolFormEntry,
    value: string | number | undefined
  ) => {
    const updated = tools.map((t, i) => {
      if (i !== index) return t
      return { ...t, [field]: value }
    })
    onChange({ tools: updated })
  }

  const isSelected = (vendorId: string) =>
    tools.some((t) => t.vendorId === vendorId)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-1">
          Which AI tools does your team pay for?
        </h2>
        <p className="text-sm text-slate-500">
          Select the tools you currently subscribe to. Enter your actual monthly spend.
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          Select tools
        </p>
        <div className="flex flex-wrap gap-2">
          {vendors.map((vendor) => (
            <button
              key={vendor.id}
              type="button"
              onClick={() => addTool(vendor.id)}
              disabled={isSelected(vendor.id)}
              aria-pressed={isSelected(vendor.id)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium border transition-colors',
                isSelected(vendor.id)
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700 cursor-default'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-600'
              )}
            >
              {vendor.name}
              {isSelected(vendor.id) && (
                <span className="ml-1.5 text-emerald-500" aria-hidden="true">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {tools.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Your tools ({tools.length})
          </p>
          {tools.map((tool, index) => (
            <ToolCard
              key={`${tool.vendorId}-${index}`}
              index={index}
              entry={tool}
              onChange={updateTool}
              onRemove={removeTool}
            />
          ))}
        </div>
      )}

      {tools.length === 0 && (
        <div
          className="text-center py-8 border border-dashed border-slate-200 rounded-lg"
          aria-live="polite"
        >
          <p className="text-sm text-slate-400">
            Select at least one tool above to continue
          </p>
        </div>
      )}

      {errors.tools && (
        <p className="text-xs text-red-500" role="alert">
          {errors.tools}
        </p>
      )}
    </div>
  )
}
