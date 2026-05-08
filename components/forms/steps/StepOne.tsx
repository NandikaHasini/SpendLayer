'use client'

import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { AuditFormValues } from '@/types/form'
import type { PrimaryUseCase, UsageIntensity } from '@/types/audit'

interface StepOneProps {
  values: Partial<AuditFormValues>
  onChange: (partial: Partial<AuditFormValues>) => void
  errors: Partial<Record<keyof AuditFormValues, string>>
}

const USE_CASES: { value: PrimaryUseCase; label: string; description: string }[] = [
  { value: 'coding', label: 'Software Development', description: 'Writing, reviewing, and debugging code' },
  { value: 'writing', label: 'Writing & Content', description: 'Drafting documents, emails, and content' },
  { value: 'research', label: 'Research & Analysis', description: 'Synthesizing information and insights' },
  { value: 'customer_support', label: 'Customer Support', description: 'Responding to and triaging queries' },
  { value: 'data_analysis', label: 'Data Analysis', description: 'Interpreting and transforming data' },
  { value: 'general', label: 'General Use', description: 'Mixed everyday tasks' },
]

const INTENSITY_OPTIONS: { value: UsageIntensity; label: string; description: string }[] = [
  { value: 'light', label: 'Light', description: 'A few times per week' },
  { value: 'moderate', label: 'Moderate', description: 'Daily use across tasks' },
  { value: 'heavy', label: 'Heavy', description: 'Core to daily workflow' },
]

export function StepOne({ values, onChange, errors }: StepOneProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-1">
          How does your team use AI?
        </h2>
        <p className="text-sm text-slate-500">
          This helps us understand your workflow before auditing your spend.
        </p>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium text-slate-700">
          Primary use case
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {USE_CASES.map((uc) => (
            <button
              key={uc.value}
              type="button"
              onClick={() => onChange({ primaryUseCase: uc.value })}
              className={cn(
                'text-left p-3 rounded-lg border text-sm transition-colors',
                values.primaryUseCase === uc.value
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              )}
            >
              <p className="font-medium">{uc.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{uc.description}</p>
            </button>
          ))}
        </div>
        {errors.primaryUseCase && (
          <p className="text-xs text-red-500">{errors.primaryUseCase}</p>
        )}
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium text-slate-700">
          Usage intensity
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {INTENSITY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ usageIntensity: opt.value })}
              className={cn(
                'text-left p-3 rounded-lg border text-sm transition-colors',
                values.usageIntensity === opt.value
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              )}
            >
              <p className="font-medium">{opt.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{opt.description}</p>
            </button>
          ))}
        </div>
        {errors.usageIntensity && (
          <p className="text-xs text-red-500">{errors.usageIntensity}</p>
        )}
      </div>
    </div>
  )
}
