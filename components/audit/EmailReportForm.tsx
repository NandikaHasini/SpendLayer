'use client'

import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface EmailReportFormProps {
  companyName?: string
  totalMonthlySpend: number
  totalPotentialSavings: number
  recommendationCount: number
  criticalCount: number
  reportUrl?: string
  auditDate?: string
  className?: string
}

type FormState = 'idle' | 'loading' | 'success' | 'error'

function defaultAuditDate(): string {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function validateEmail(value: string): string | null {
  const trimmed = value.trim()

  if (!trimmed) {
    return 'Email address is required.'
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return 'Please enter a valid email address.'
  }

  return null
}

export function EmailReportForm({
  companyName,
  totalMonthlySpend,
  totalPotentialSavings,
  recommendationCount,
  criticalCount,
  reportUrl,
  auditDate,
  className,
}: EmailReportFormProps) {
  const [formState, setFormState] = useState<FormState>('idle')
  const [email, setEmail] = useState('')
  const [touched, setTouched] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const inputId = useId()
  const errorId = useId()
  const statusId = useId()

  const validationError = touched ? validateEmail(email) : null
  const isDisabled = formState === 'loading'

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setTouched(true)

    const nextValidationError = validateEmail(email)

    if (nextValidationError) {
      setFormState('idle')
      setErrorMessage('')
      return
    }

    setFormState('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/email-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientEmail: email.trim(),
          companyName,
          totalMonthlySpend,
          totalPotentialSavings,
          recommendationCount,
          criticalCount,
          reportUrl:
            reportUrl ??
            (typeof window !== 'undefined'
              ? window.location.href
              : ''),
          auditDate: auditDate ?? defaultAuditDate(),
        }),
      })

      if (!response.ok) {
        setFormState('error')
        setErrorMessage(
          'Unable to deliver the report right now. Your audit results are still saved above.'
        )
        return
      }

      const data = (await response.json()) as {
        success?: boolean
        error?: string
      }

      if (data.success === false) {
        setFormState('error')
        setErrorMessage(
          data.error ??
            'Report could not be sent. Please try again.'
        )
        return
      }

      setFormState('success')
    } catch {
      setFormState('error')
      setErrorMessage(
        'Unable to deliver the report right now. Your audit results are still saved above.'
      )
    }
  }

  const handleReset = () => {
    setFormState('idle')
    setEmail('')
    setTouched(false)
    setErrorMessage('')
  }

  if (formState === 'success') {
    return (
      <div
        role="status"
        aria-live="polite"
        id={statusId}
        className={cn(
          'rounded-lg border border-green-200 bg-green-50 p-4',
          className
        )}
      >
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-green-700" />

          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold text-green-900">
              Report sent!
            </h2>

            <p className="mt-1 break-words text-sm text-green-800">
              We sent this audit report to {email.trim()}.
            </p>

            <button
              type="button"
              onClick={handleReset}
              className="mt-3 inline-flex h-8 items-center justify-center rounded-lg border border-green-300 bg-white px-3 text-sm font-medium text-green-800 hover:bg-green-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
            >
              Send to another address
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'rounded-lg border border-slate-200 bg-slate-50 p-4',
        className
      )}
    >
      <p className="mb-3 text-sm font-medium text-slate-700">
        Email this report
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor={inputId} className="sr-only">
          Email address
        </label>

        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id={inputId}
            type="email"
            autoComplete="email"
            maxLength={320}
            disabled={isDisabled}
            placeholder="you@company.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value.slice(0, 320))

              if (errorMessage) {
                setErrorMessage('')
              }
            }}
            onBlur={() => setTouched(true)}
            aria-invalid={validationError ? 'true' : 'false'}
            aria-describedby={
              validationError
                ? `${errorId} ${statusId}`
                : statusId
            }
            className="h-9 min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
          />

          <button
            type="submit"
            disabled={isDisabled}
            aria-busy={formState === 'loading' ? 'true' : 'false'}
            className={cn(
              'inline-flex h-9 flex-none items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:bg-slate-400',
              formState === 'loading' && 'cursor-wait'
            )}
          >
            {formState === 'loading' && (
              <span
                aria-hidden="true"
                className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"
              />
            )}

            {formState === 'loading'
              ? 'Sending…'
              : 'Send report'}
          </button>
        </div>

        <div
          id={statusId}
          className="sr-only"
          aria-live="polite"
        >
          {formState === 'loading'
            ? 'Sending report email.'
            : 'Email form ready.'}
        </div>

        {validationError && (
          <p
            id={errorId}
            role="alert"
            aria-live="assertive"
            className="mt-2 text-sm text-red-700"
          >
            {validationError}
          </p>
        )}

        {formState === 'error' && errorMessage && (
          <div
            role="alert"
            aria-live="assertive"
            className="mt-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-none" />

            <p>{errorMessage}</p>
          </div>
        )}
      </form>
    </div>
  )
}