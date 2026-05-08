'use client'

import { useRouter } from 'next/navigation'
import { useAuditFormStore } from '@/store/auditFormStore'
import { useAuditStore } from '@/store/auditStore'
import { runAudit } from '@/lib/audit/engine'
import { stepOneSchema, stepTwoSchema, stepThreeSchema } from '@/lib/audit/form-schema'
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
import { useState } from 'react'

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
  } catch (err: any) {
    const errors: Partial<Record<string, string>> = {}
    const issues = err?.issues ?? err?.errors
    if (issues) {
      for (const e of issues) {
        const key = e.path?.[0] as string
        if (key) errors[key] = e.message
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

  const handleChange = (partial: Partial<AuditFormValues>) => {
    updateValues(partial)
    setErrors({})
  }

  const handleNext = () => {
    const stepErrors = validateStep(currentStep, values)
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      return
    }
    setErrors({})
    if (currentStep < TOTAL_STEPS) {
      setStep((currentStep + 1) as FormStep)
    }
  }

  const handleBack = () => {
    setErrors({})
    if (currentStep > 1) {
      setStep((currentStep - 1) as FormStep)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!values.agreedToAudit) {
      setErrors({ agreedToAudit: 'Please confirm to generate your audit' })
      return
    }

    const stepErrors = validateStep(currentStep, values)
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      return
    }

    setSubmitting(true)

    try {
      const auditInput: AuditInput = {
        tools: values.tools ?? [],
        teamSize: values.teamSize ?? 1,
        workflowType: values.workflowType ?? 'solo_developer',
        usageIntensity: values.usageIntensity ?? 'moderate',
        primaryUseCase: values.primaryUseCase ?? 'general',
        overlappingSubscriptions: values.overlappingSubscriptions ?? false,
      }

      const result = runAudit(auditInput)
      const auditId = generateAuditId()
      setAuditResult(result, auditId)
      resetForm()
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
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          labels={STEP_LABELS}
        />

        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="pt-6 pb-6">
            {currentStep === 1 && (
              <StepOne values={values} onChange={handleChange} errors={errors} />
            )}
            {currentStep === 2 && (
              <StepTwo values={values} onChange={handleChange} errors={errors} />
            )}
            {currentStep === 3 && (
              <StepThree values={values} onChange={handleChange} errors={errors} />
            )}
            {currentStep === 4 && (
              <StepFour values={values} onChange={handleChange} errors={errors} />
            )}
          </CardContent>
        </Card>

        {errors.form && (
          <p className="text-sm text-red-500 text-center">{errors.form}</p>
        )}

        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="text-slate-500"
          >
            ← Back
          </Button>

          {currentStep < TOTAL_STEPS ? (
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
              disabled={!values.agreedToAudit}
            />
          )}
        </div>
      </div>
    </form>
  )
}
