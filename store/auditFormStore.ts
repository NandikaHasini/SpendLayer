import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuditFormValues, FormStep } from '@/types/form'

interface AuditFormStore {
  currentStep: FormStep
  values: Partial<AuditFormValues>
  isSubmitting: boolean
  lastSavedAt: string | null

  setStep: (step: FormStep) => void
  updateValues: (partial: Partial<AuditFormValues>) => void
  setSubmitting: (value: boolean) => void
  resetForm: () => void
}

const initialValues: Partial<AuditFormValues> = {}

export const useAuditFormStore = create<AuditFormStore>()(
  persist(
    (set) => ({
      currentStep: 1,
      values: initialValues,
      isSubmitting: false,
      lastSavedAt: null,

      setStep: (step) => set({ currentStep: step }),

      updateValues: (partial) =>
        set((state) => ({
          values: { ...state.values, ...partial },
          lastSavedAt: new Date().toISOString(),
        })),

      setSubmitting: (value) => set({ isSubmitting: value }),

      resetForm: () =>
        set({
          currentStep: 1,
          values: initialValues,
          isSubmitting: false,
          lastSavedAt: null,
        }),
    }),
    {
      name: 'spendlayer-audit-form',
      partialize: (state) => ({
        currentStep: state.currentStep,
        values: state.values,
        lastSavedAt: state.lastSavedAt,
      }),
    }
  )
)
