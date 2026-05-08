'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { SelectedTool, UseCase } from '@/types'
import type { AuditResult } from '@/types/audit'

interface AuditStore {
  // Persisted to localStorage
  currentStep: number
  selectedTools: SelectedTool[]
  teamSize: number
  useCase: UseCase | ''

  // Session only — never persisted
  auditResult: AuditResult | null
  auditId: string | null
  isSubmitting: boolean

  // Actions
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  addTool: (tool: SelectedTool) => void
  removeTool: (toolId: string) => void
  updateTool: (toolId: string, updates: Partial<SelectedTool>) => void
  setTeamSize: (size: number) => void
  setUseCase: (useCase: UseCase) => void
  setAuditResult: (result: AuditResult, id: string) => void
  clearAuditResult: () => void
  setIsSubmitting: (value: boolean) => void
  resetForm: () => void
}

const defaultState = {
  currentStep: 0,
  selectedTools: [] as SelectedTool[],
  teamSize: 1,
  useCase: '' as UseCase | '',
  auditResult: null,
  auditId: null,
  isSubmitting: false,
}

export const useAuditStore = create<AuditStore>()(
  persist(
    (set) => ({
      ...defaultState,

      setStep: (step) => set({ currentStep: step }),

      nextStep: () =>
        set((state) => ({ currentStep: state.currentStep + 1 })),

      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(0, state.currentStep - 1),
        })),

      addTool: (tool) =>
        set((state) => {
          const exists = state.selectedTools.some((t) => t.toolId === tool.toolId)
          if (exists) return state
          return { selectedTools: [...state.selectedTools, tool] }
        }),

      removeTool: (toolId) =>
        set((state) => ({
          selectedTools: state.selectedTools.filter((t) => t.toolId !== toolId),
        })),

      updateTool: (toolId, updates) =>
        set((state) => ({
          selectedTools: state.selectedTools.map((t) =>
            t.toolId === toolId ? { ...t, ...updates } : t
          ),
        })),

      setTeamSize: (size) => set({ teamSize: size }),

      setUseCase: (useCase) => set({ useCase }),

      setAuditResult: (result, id) =>
        set({ auditResult: result, auditId: id }),

      clearAuditResult: () =>
        set({ auditResult: null, auditId: null }),

      setIsSubmitting: (value) => set({ isSubmitting: value }),

      resetForm: () => set({ ...defaultState }),
    }),
    {
      name: 'spendlayer-audit-form',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentStep: state.currentStep,
        selectedTools: state.selectedTools,
        teamSize: state.teamSize,
        useCase: state.useCase,
      }),
    }
  )
)
