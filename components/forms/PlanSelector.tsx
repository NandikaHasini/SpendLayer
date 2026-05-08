'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getVendorById } from '@/lib/pricing'

interface PlanSelectorProps {
  vendorId: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function PlanSelector({
  vendorId,
  value,
  onChange,
  disabled,
}: PlanSelectorProps) {
  const vendor = getVendorById(vendorId)

  if (!vendor) return null

  return (
    <Select
      value={value}
      onValueChange={(nextValue) => {
        if (nextValue) onChange(nextValue)
      }}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select plan" />
      </SelectTrigger>
      <SelectContent>
        {vendor.plans.map((plan) => (
          <SelectItem key={plan.planName} value={plan.planName}>
            <span className="flex items-center gap-2">
              <span>{plan.planName}</span>
              {plan.monthlyPricePerSeat > 0 && (
                <span className="text-slate-400 text-xs">
                  ${plan.monthlyPricePerSeat}/seat/mo
                </span>
              )}
              {plan.monthlyPricePerSeat === 0 && (
                <span className="text-emerald-500 text-xs">Free</span>
              )}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
