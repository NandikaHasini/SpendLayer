'use client'

import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import {
  numberInputValue,
  parseOptionalIntegerInput,
  parseOptionalMoneyInput,
} from '@/lib/audit/numeric-input'
import { PlanSelector } from './PlanSelector'
import { getVendorById } from '@/lib/pricing'
import type { ToolFormEntry } from '@/types/form'

interface ToolCardProps {
  index: number
  entry: ToolFormEntry
  onChange: (
    index: number,
    field: keyof ToolFormEntry,
    value: string | number | undefined
  ) => void
  onRemove: (index: number) => void
  errors?: {
    planName?: string
    seats?: string
    monthlySpend?: string
  }
}

export function ToolCard({
  index,
  entry,
  onChange,
  onRemove,
  errors,
}: ToolCardProps) {
  const vendor = getVendorById(entry.vendorId)

  if (!vendor) return null

  return (
    <Card className="border border-slate-200 bg-white">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-semibold text-slate-800 text-sm">{vendor.name}</p>
            <p className="text-xs text-slate-400">{vendor.description}</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemove(index)}
            className="text-slate-400 hover:text-red-500 -mt-1 -mr-2"
            aria-label={`Remove ${vendor.name}`}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label className="text-xs text-slate-500">Plan</Label>
            <PlanSelector
              vendorId={entry.vendorId}
              value={entry.planName}
              onChange={(val) => onChange(index, 'planName', val)}
            />
            {errors?.planName && (
              <p className="text-xs text-red-500">{errors.planName}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-slate-500">Seats</Label>
            <Input
              type="number"
              min={1}
              value={numberInputValue(entry.seats)}
              onChange={(e) =>
                onChange(index, 'seats', parseOptionalIntegerInput(e.target.value))
              }
              placeholder="1"
              className="text-sm"
              aria-invalid={Boolean(errors?.seats)}
              aria-describedby={errors?.seats ? `tool-${index}-seats-error` : undefined}
            />
            {errors?.seats && (
              <p
                id={`tool-${index}-seats-error`}
                className="text-xs text-red-500"
                role="alert"
              >
                {errors.seats}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-slate-500">Monthly spend ($)</Label>
            <Input
              type="number"
              min={0}
              step={0.01}
              value={numberInputValue(entry.monthlySpend)}
              onChange={(e) =>
                onChange(
                  index,
                  'monthlySpend',
                  parseOptionalMoneyInput(e.target.value)
                )
              }
              placeholder="0.00"
              className="text-sm"
              aria-invalid={Boolean(errors?.monthlySpend)}
              aria-describedby={
                errors?.monthlySpend ? `tool-${index}-spend-error` : undefined
              }
            />
            {errors?.monthlySpend && (
              <p
                id={`tool-${index}-spend-error`}
                className="text-xs text-red-500"
                role="alert"
              >
                {errors.monthlySpend}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
