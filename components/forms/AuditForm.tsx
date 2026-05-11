'use client'

import { useRouter } from 'next/navigation'
import { useAuditFormStore } from '@/store/auditFormStore'
import { useAuditStore } from '@/store/auditStore'
import { runAudit } from '@/lib/audit/engine'
import {
  auditFormSchema,
  stepOneSchema,
  stepTwoSchema,
  stepThreeSchema,
} from '@/lib/audit/form-schema'
import { normalizeFormStep } from '@/lib/audit/form-step'
import { persistReportViaApi } from '@/lib/report-client'
import { StepIndicator } from './StepIndicator'
import { StepOne } from './steps/StepOne'
import { StepTwo } from './steps/StepTwo'
import { StepThree } from './steps/StepThree'
import { StepFour } from './steps/StepFour'
import { AuditSubmitButton } from '@/components/audit/AuditSubmitButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { AuditFormValues, FormStep } from '@/types/form'
import type { AuditInput } from '@/types/audit'
import { useEffect, useState } from 'react'

const STEP_LABELS = ['Usage', 'Team', 'Tools', 'Review']
const TOTAL_STEPS = 4

function generateAuditId(): string {
  return Math.random().toString(36).substring(2, 10)
}

function validateStep(
  step: number,
  values: Partial<AuditFormValues>
): Partial<Record<string, string>> {
  try {
    if (step === 1) stepOneSchema.parse(values)
    if (step === 2) stepTwoSchema.parse(values)
    if (step === 3) stepThreeSchema.parse(values)
    return {}
  } catch (err: unknown) {
    const errors: Partial<Record<string, string>> = {}
    const issues =
      typeof err === 'object' && err !== null
        ? 'issues' in err
          ? err.issues
          : 'errors' in err
            ? err.errors
            : null
        : null

    if (Array.isArray(issues)) {
      for (const e of issues) {
        const key = Array.isArray(e.path) ? e.path[0] : null
        if (typeof key === 'string' && typeof e.message === 'string') {
          errors[key] = e.message
        }
      }
    }
    return errors
  }
}

export function AuditForm() {
  const router = useRouter()
  const { currentStep, values, isSubmitting, setStep, updateValues, setSubmitting, resetForm } =
    useAuditFormStore()
  const { setAuditResult } = useAuditStore()
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({})
  const [hasMounted, setHasMounted] = useState(false)
  const displayStep = hasMounted ? normalizeFormStep(currentStep) : 1

  useEffect(() => {
    queueMicrotask(() => setHasMounted(true))
  }, [])

  const handleChange = (partial: Partial<AuditFormValues>) => {
    updateValues(partial)
    setErrors({})
  }

  const handleNext = () => {
    const stepErrors = validateStep(displayStep, values)
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      return
    }
    setErrors({})
    if (displayStep < TOTAL_STEPS) {
      setStep((displayStep + 1) as FormStep)
    }
  }

  const handleBack = () => {
    setErrors({})
    if (displayStep > 1) {
      setStep((displayStep - 1) as FormStep)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!values.agreedToAudit) {
      setErrors({ agreedToAudit: 'Please confirm to generate your audit' })
      return
    }

    const fullFormResult = auditFormSchema.safeParse(values)
    if (!fullFormResult.success) {
      const formErrors: Partial<Record<string, string>> = {}
      for (const issue of fullFormResult.error.issues) {
        const key = issue.path?.[0] as string
        if (key) formErrors[key] = issue.message
      }
      setErrors(formErrors)
      return
    }

    setSubmitting(true)

    try {
      const auditInput: AuditInput = {
        tools: fullFormResult.data.tools,
        teamSize: fullFormResult.data.teamSize,
        workflowType: fullFormResult.data.workflowType,
        usageIntensity: fullFormResult.data.usageIntensity,
        primaryUseCase: fullFormResult.data.primaryUseCase,
        overlappingSubscriptions: fullFormResult.data.overlappingSubscriptions,
      }

      const result = runAudit(auditInput)
      const auditId = generateAuditId()
      resetForm()
      setAuditResult(result, auditId)

      const persistenceResult = await persistReportViaApi(auditId, auditInput, result)
      if (!persistenceResult.ok) {
        console.warn(persistenceResult.message ?? 'Report persistence failed.')
      }

      router.push(`/spend-report/${auditId}`)
    } catch (err) {
      console.error('Audit generation failed:', err)
      setErrors({ form: 'Something went wrong. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-6">
        <StepIndicator
          currentStep={displayStep}
          totalSteps={TOTAL_STEPS}
          labels={STEP_LABELS}
        />

        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="pt-6 pb-6">
            {displayStep === 1 && (
              <StepOne values={values} onChange={handleChange} errors={errors} />
            )}
            {displayStep === 2 && (
              <StepTwo values={values} onChange={handleChange} errors={errors} />
            )}
            {displayStep === 3 && (
              <StepThree values={values} onChange={handleChange} errors={errors} />
            )}
            {displayStep === 4 && (
              <StepFour values={values} onChange={handleChange} errors={errors} />
            )}
          </CardContent>
        </Card>

        {errors.form && (
          <p className="text-sm text-red-500 text-center" role="alert">
            {errors.form}
          </p>
        )}

        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBack}
            disabled={Boolean(displayStep === 1)}
            className="text-slate-500"
          >
            ← Back
          </Button>

          {displayStep < TOTAL_STEPS ? (
            <Button
              type="button"
              onClick={handleNext}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6"
            >
              Continue →
            </Button>
          ) : (
            <AuditSubmitButton
              isSubmitting={isSubmitting}
              disabled={Boolean(!values.agreedToAudit)}
            />
          )}
        </div>
      </div>
    </form>
  )
}
