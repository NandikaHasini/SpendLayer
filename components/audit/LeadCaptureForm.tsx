'use client'

import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface LeadCaptureFormProps {
  auditId: string
}

type SubmitState = 'idle' | 'submitting' | 'success'

export function LeadCaptureForm({ auditId }: LeadCaptureFormProps) {
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [emailError, setEmailError] = useState<string | null>(null)
  const controllerRef = useRef<AbortController | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mountedRef = useRef(false)

  useEffect(() => {
    mountedRef.current = true

    return () => {
      mountedRef.current = false
      controllerRef.current?.abort()
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const validateEmail = (value: string): boolean => {
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
    setEmailError(valid ? null : 'Please enter a valid email address')
    return valid
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (submitState === 'submitting') return
    if (!validateEmail(email)) return

    setSubmitState('submitting')

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)
    controllerRef.current = controller
    timeoutRef.current = timeout

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          company: company.trim() || null,
          role: role.trim() || null,
          auditId,
          website: '',
        }),
        signal: controller.signal,
      })
    } catch {
      // Graceful degradation — always show success to user
    } finally {
      clearTimeout(timeout)
      if (timeoutRef.current === timeout) timeoutRef.current = null
      if (controllerRef.current === controller) controllerRef.current = null
      if (mountedRef.current) setSubmitState('success')
    }
  }

  if (submitState === 'success') {
    return (
      <Card className="border border-emerald-200 bg-emerald-50">
        <CardContent className="pt-5 pb-5 text-center">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
            <span className="text-emerald-600 text-sm">✓</span>
          </div>
          <p className="text-sm font-medium text-emerald-800">
            You&apos;re on the list
          </p>
          <p className="text-xs text-emerald-600 mt-1">
            We&apos;ll notify you when new optimization opportunities are available.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-slate-200 bg-white">
      <CardContent className="pt-5 pb-5">
        <div className="mb-4">
          <p className="text-sm font-semibold text-slate-800">
            Get notified when pricing changes affect your stack
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            No spam. One email when something relevant changes.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-3">
          <div className="hidden" aria-hidden="true">
            <Label htmlFor="lead-website">Website</Label>
            <Input
              id="lead-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value=""
              onChange={() => undefined}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="lead-email" className="text-xs text-slate-500">
              Work email
            </Label>
            <Input
              id="lead-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (emailError) validateEmail(e.target.value)
              }}
              placeholder="you@company.com"
              className="text-sm w-full"
              required
              autoComplete="email"
              aria-invalid={!!emailError}
              aria-describedby={emailError ? 'lead-email-error' : undefined}
            />
            {emailError && (
              <p id="lead-email-error" className="text-xs text-red-500">
                {emailError}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor="lead-company" className="text-xs text-slate-500">
                Company
              </Label>
              <Input
                id="lead-company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Inc"
                className="text-sm w-full"
                autoComplete="organization"
                maxLength={200}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="lead-role" className="text-xs text-slate-500">
                Your role
              </Label>
              <Input
                id="lead-role"
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Founder, CTO..."
                className="text-sm w-full"
                autoComplete="organization-title"
                maxLength={200}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={submitState === 'submitting' || !email}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold"
          >
            {submitState === 'submitting' ? (
              <>
                <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Notify me'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
