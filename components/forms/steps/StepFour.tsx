'use client'

import { Label } from '@/components/ui/label'
import type { AuditFormValues } from '@/types/form'

interface StepFourProps {
  values: Partial<AuditFormValues>
  onChange: (partial: Partial<AuditFormValues>) => void
  errors: Partial<Record<keyof AuditFormValues, string>>
}

export function StepFour({ values, onChange, errors }: StepFourProps) {
  const tools = values.tools ?? []
  const totalSpend = tools.reduce((sum, t) => sum + (t.monthlySpend ?? 0), 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-1">
          Review your audit inputs
        </h2>
        <p className="text-sm text-slate-500">
          Confirm your stack details before we generate your audit report.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 divide-y divide-slate-100">
        <div className="px-4 py-3 flex justify-between text-sm">
          <span className="text-slate-500">Primary use case</span>
          <span className="font-medium text-slate-800 capitalize">
            {values.primaryUseCase?.replace('_', ' ') ?? '-'}
          </span>
        </div>
        <div className="px-4 py-3 flex justify-between text-sm">
          <span className="text-slate-500">Usage intensity</span>
          <span className="font-medium text-slate-800 capitalize">
            {values.usageIntensity ?? '-'}
          </span>
        </div>
        <div className="px-4 py-3 flex justify-between text-sm">
          <span className="text-slate-500">Team size</span>
          <span className="font-medium text-slate-800">
            {values.teamSize ?? '-'}
          </span>
        </div>
        <div className="px-4 py-3 flex justify-between text-sm">
          <span className="text-slate-500">Workflow type</span>
          <span className="font-medium text-slate-800 capitalize">
            {values.workflowType?.replace('_', ' ') ?? '-'}
          </span>
        </div>
        <div className="px-4 py-3 flex justify-between text-sm">
          <span className="text-slate-500">Tools selected</span>
          <span className="font-medium text-slate-800">
            {tools.length} tool{tools.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="px-4 py-3 flex justify-between text-sm">
          <span className="text-slate-500">Current monthly spend</span>
          <span className="font-semibold text-slate-800">
            ${totalSpend.toFixed(2)}/mo
          </span>
        </div>
      </div>

      <div className="flex items-start gap-3 p-3 rounded-lg border border-emerald-200 bg-emerald-50">
        <input
          id="agreedToAudit"
          type="checkbox"
          checked={values.agreedToAudit ?? false}
          onChange={(e) => onChange({ agreedToAudit: e.target.checked })}
          className="mt-0.5 accent-emerald-600"
        />
        <div>
          <Label
            htmlFor="agreedToAudit"
            className="text-sm font-medium text-emerald-800 cursor-pointer"
          >
            Generate my spend audit
          </Label>
          <p className="text-xs text-emerald-700 mt-0.5">
            SpendLayer will analyze your stack using verified pricing data and deterministic rules.
            No AI guesswork. No data stored yet.
          </p>
        </div>
      </div>

      {errors.agreedToAudit && (
        <p className="text-xs text-red-500">{errors.agreedToAudit}</p>
      )}
    </div>
  )
}
