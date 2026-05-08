'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { numberInputValue, parseOptionalIntegerInput } from '@/lib/audit/numeric-input'
import { cn } from '@/lib/utils'
import type { AuditFormValues } from '@/types/form'
import type { WorkflowType } from '@/types/audit'

interface StepTwoProps {
  values: Partial<AuditFormValues>
  onChange: (partial: Partial<AuditFormValues>) => void
  errors: Partial<Record<keyof AuditFormValues, string>>
}

const WORKFLOW_OPTIONS: { value: WorkflowType; label: string; description: string }[] = [
  { value: 'solo_developer', label: 'Solo / Freelancer', description: 'Just you' },
  { value: 'small_team', label: 'Small Team', description: '2-10 people' },
  { value: 'mid_team', label: 'Mid Team', description: '11-50 people' },
  { value: 'large_team', label: 'Large Team', description: '50+ people' },
]

export function StepTwo({ values, onChange, errors }: StepTwoProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-1">
          Tell us about your team
        </h2>
        <p className="text-sm text-slate-500">
          Team context helps produce more accurate optimization recommendations.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="teamSize" className="text-sm font-medium text-slate-700">
          How many people use AI tools on your team?
        </Label>
        <Input
          id="teamSize"
          type="number"
          min={1}
          max={100000}
          value={numberInputValue(values.teamSize)}
          onChange={(e) =>
            onChange({ teamSize: parseOptionalIntegerInput(e.target.value) })
          }
          placeholder="e.g. 5"
          className="max-w-xs"
        />
        {errors.teamSize && (
          <p className="text-xs text-red-500">{errors.teamSize}</p>
        )}
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium text-slate-700">
          Team size range
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {WORKFLOW_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ workflowType: opt.value })}
              className={cn(
                'text-left p-3 rounded-lg border text-sm transition-colors',
                values.workflowType === opt.value
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              )}
            >
              <p className="font-medium">{opt.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{opt.description}</p>
            </button>
          ))}
        </div>
        {errors.workflowType && (
          <p className="text-xs text-red-500">{errors.workflowType}</p>
        )}
      </div>

      <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50">
        <input
          id="overlapping"
          type="checkbox"
          checked={values.overlappingSubscriptions ?? false}
          onChange={(e) =>
            onChange({ overlappingSubscriptions: e.target.checked })
          }
          className="mt-0.5 accent-emerald-500"
        />
        <div>
          <Label
            htmlFor="overlapping"
            className="text-sm font-medium text-slate-700 cursor-pointer"
          >
            We have overlapping AI subscriptions
          </Label>
          <p className="text-xs text-slate-400 mt-0.5">
            e.g. paying for both ChatGPT and Claude for similar workflows
          </p>
        </div>
      </div>
    </div>
  )
}
