import type { FormStep } from '@/types/form'

export function normalizeFormStep(step: unknown): FormStep {
  return step === 1 || step === 2 || step === 3 || step === 4 ? step : 1
}
