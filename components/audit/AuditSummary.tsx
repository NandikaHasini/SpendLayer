'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { buildFallbackSummary } from '@/lib/ai/summary-fallback'
import type { AuditResult } from '@/types/audit'

interface AuditSummaryProps {
  auditResult: AuditResult
}

type SummaryState =
  | { status: 'loading' }
  | { status: 'ready'; text: string; source: 'ai' | 'fallback' }
  | { status: 'error'; text: string }

export function AuditSummary({ auditResult }: AuditSummaryProps) {
  const [state, setState] = useState<SummaryState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    async function fetchSummary() {
      try {
        const response = await fetch('/api/summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ auditResult }),
          signal: controller.signal,
        })

        clearTimeout(timeout)

        if (!response.ok) throw new Error('Summary API failed')

        const data = await response.json()

        if (cancelled) return

        if (data?.summary && typeof data.summary === 'string') {
          setState({
            status: 'ready',
            text: data.summary,
            source: data.source ?? 'fallback',
          })
        } else {
          throw new Error('Invalid summary response')
        }
      } catch {
        clearTimeout(timeout)
        if (cancelled) return
        setState({
          status: 'ready',
          text: buildFallbackSummary(auditResult),
          source: 'fallback',
        })
      }
    }

    fetchSummary()

    return () => {
      cancelled = true
      controller.abort()
      clearTimeout(timeout)
    }
  }, [auditResult])

  return (
    <Card className="border border-slate-200 bg-white">
      <CardContent className="pt-5 pb-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Audit Summary
          </p>
          {state.status === 'ready' && state.source === 'ai' && (
            <span
              className="ml-auto text-xs text-slate-300"
              title="Summary generated from deterministic audit results"
            >
              AI-assisted
            </span>
          )}
        </div>

        {state.status === 'loading' && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        )}

        {(state.status === 'ready' || state.status === 'error') && (
          <p className="text-sm text-slate-700 leading-relaxed">
            {state.status === 'ready'
              ? state.text
              : buildFallbackSummary(auditResult)}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
