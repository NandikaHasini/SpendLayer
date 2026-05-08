'use client'

import { cn } from '@/lib/utils'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  labels: string[]
}

export function StepIndicator({
  currentStep,
  totalSteps,
  labels,
}: StepIndicatorProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        {labels.map((label, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep

          return (
            <div key={label} className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                {index > 0 && (
                  <div
                    className={cn(
                      'h-0.5 flex-1',
                      isCompleted || isCurrent
                        ? 'bg-emerald-500'
                        : 'bg-slate-200'
                    )}
                  />
                )}
                <div
                  className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0',
                    isCompleted &&
                      'bg-emerald-500 text-white',
                    isCurrent &&
                      'bg-emerald-600 text-white ring-2 ring-emerald-200',
                    !isCompleted &&
                      !isCurrent &&
                      'bg-slate-100 text-slate-400'
                  )}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted ? '✓' : stepNumber}
                </div>
                {index < totalSteps - 1 && (
                  <div
                    className={cn(
                      'h-0.5 flex-1',
                      isCompleted ? 'bg-emerald-500' : 'bg-slate-200'
                    )}
                  />
                )}
              </div>
              <span
                className={cn(
                  'text-xs mt-1 text-center hidden sm:block',
                  isCurrent ? 'text-emerald-600 font-medium' : 'text-slate-400'
                )}
              >
                {label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
