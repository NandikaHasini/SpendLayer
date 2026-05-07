import { VENDORS } from './tools'
import type { Vendor, ToolPlan } from '@/types/audit'

export function getVendorById(id: string): Vendor | undefined {
  return VENDORS.find((v) => v.id === id)
}

export function getPlanByName(vendorId: string, planName: string): ToolPlan | undefined {
  const vendor = getVendorById(vendorId)
  return vendor?.plans.find(
    (p) => p.planName.toLowerCase() === planName.toLowerCase()
  )
}

export function getEffectiveMonthlyCost(plan: ToolPlan, seats: number): number {
  if (plan.flatMonthlyPrice !== null) return plan.flatMonthlyPrice
  return plan.monthlyPricePerSeat * seats
}

export function getCheaperPlans(vendorId: string, currentPlanName: string, seats: number): ToolPlan[] {
  const vendor = getVendorById(vendorId)
  if (!vendor) return []
  const currentPlan = getPlanByName(vendorId, currentPlanName)
  if (!currentPlan) return []
  const currentCost = getEffectiveMonthlyCost(currentPlan, seats)
  return vendor.plans.filter((plan) => {
    const cost = getEffectiveMonthlyCost(plan, seats)
    return cost < currentCost
  })
}

export function getOverlappingVendors(vendorId: string): Vendor[] {
  const vendor = getVendorById(vendorId)
  if (!vendor) return []
  return vendor.overlaps
    .map((id) => getVendorById(id))
    .filter((v): v is Vendor => v !== undefined)
}

export function getAllVendors(): Vendor[] {
  return VENDORS
}
