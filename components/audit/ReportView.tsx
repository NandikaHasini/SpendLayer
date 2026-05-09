'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Link2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { AuditSummary } from '@/components/audit/AuditSummary'
import { LeadCaptureForm } from '@/components/audit/LeadCaptureForm'
import { useAuditStore } from '@/store/auditStore'
import {
  getRecommendationTarget,
  getReportFallbackCopy,
  RECOMMENDATION_LABELS,
} from '@/lib/audit/report-view-model'
import { formatCurrency } from '@/lib/utils'
import type { AuditRecommendation, RecommendationType } from '@/types/audit'
import type { AuditResult } from '@/types/audit'
import type { ReportLoadState } from '@/types/report'

interface ReportViewProps {
  auditId: string
  initialReport: AuditResult | null
  reportState: ReportLoadState
  reportMessage: string | null
}

function recommendationTone(type: RecommendationType): string {
  if (type === 'KEEP') return 'bg-slate-100 text-slate-700 border-slate-200'
  if (type === 'API_USAGE') return 'bg-blue-50 text-blue-700 border-blue-200'
  return 'bg-emerald-50 text-emerald-700 border-emerald-200'
}

function confidenceTone(confidence: AuditRecommendation['confidence']): string {
  if (confidence === 'HIGH') return 'bg-emerald-600 text-white'
  if (confidence === 'MEDIUM') return 'bg-amber-100 text-amber-800'
  return 'bg-slate-100 text-slate-700'
}

function ReportSkeleton() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-4 w-80 max-w-full" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-8 w-28" />
          </div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="border-slate-200">
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-6 w-20" />
              </CardContent>
            </Card>
          ))}
        </section>

        <Card className="border-slate-200">
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-full max-w-48" />
              </div>
            ))}
          </CardContent>
        </Card>

        <section className="space-y-3">
          <Skeleton className="h-5 w-44" />
          {Array.from({ length: 2 }).map((_, index) => (
            <Card key={index} className="border-slate-200">
              <CardContent className="p-5 space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-64 max-w-full" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {Array.from({ length: 3 }).map((__, itemIndex) => (
                    <div key={itemIndex} className="space-y-2">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </main>
  )
}

export function ReportView({
  auditId,
  initialReport,
  reportState,
  reportMessage,
}: ReportViewProps) {
  const [hasMounted, setHasMounted] = useState(false)
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle')
  const { auditResult, auditId: storedAuditId } = useAuditStore()

  useEffect(() => {
    setHasMounted(true)
  }, [])

  const localReport =
    hasMounted && storedAuditId === auditId ? auditResult : null
  const result = initialReport ?? localReport

  const fallback = getReportFallbackCopy(reportState, reportMessage)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopyState('copied')
      window.setTimeout(() => setCopyState('idle'), 1500)
    } catch {
      setCopyState('error')
      window.setTimeout(() => setCopyState('idle'), 1500)
    }
  }

  if (!result) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md border-slate-200">
          <CardContent className="py-8 text-center space-y-5">
            <div className="space-y-2">
              <h1 className="text-xl font-semibold text-slate-900">
                {fallback.title}
              </h1>
              <p className="text-sm text-slate-500">{fallback.message}</p>
            </div>
            <Link
              href="/audit"
              className="inline-flex h-8 items-center justify-center rounded-lg bg-emerald-600 px-3 text-sm font-medium text-white hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            >
              Return to audit
            </Link>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">
              SpendLayer audit
            </p>
            <h1 className="text-2xl font-bold text-slate-900">AI spend report</h1>
            <p className="text-sm text-slate-500">
              Deterministic recommendations from your submitted stack.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex h-8 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              aria-label="Copy report link"
            >
              <Link2 className="h-4 w-4" />
              {copyState === 'copied'
                ? 'Link copied'
                : copyState === 'error'
                  ? 'Copy failed'
                  : 'Copy link'}
            </button>
            <Link
              href="/audit"
              className="inline-flex h-8 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            >
              Run another audit
            </Link>
          </div>
        </div>

        <div aria-live="polite" className="sr-only">
          {copyState === 'copied'
            ? 'Report link copied to clipboard'
            : copyState === 'error'
              ? 'Unable to copy report link'
              : 'Report ready'}
        </div>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Card className="border-slate-200">
            <CardContent className="p-4">
              <p className="text-xs text-slate-500">Current monthly spend</p>
              <p className="text-xl font-semibold text-slate-900">
                {formatCurrency(result.totalCurrentSpend)}
              </p>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardContent className="p-4">
              <p className="text-xs text-slate-500">Optimized monthly spend</p>
              <p className="text-xl font-semibold text-slate-900">
                {formatCurrency(result.totalOptimizedSpend)}
              </p>
            </CardContent>
          </Card>
          <Card className="border-emerald-200 bg-emerald-50">
            <CardContent className="p-4">
              <p className="text-xs text-emerald-700">Monthly savings</p>
              <p className="text-xl font-semibold text-emerald-800">
                {formatCurrency(result.totalMonthlySavings)}
              </p>
            </CardContent>
          </Card>
          <Card className="border-emerald-200 bg-emerald-50">
            <CardContent className="p-4">
              <p className="text-xs text-emerald-700">Annual savings</p>
              <p className="text-xl font-semibold text-emerald-800">
                {formatCurrency(result.totalAnnualSavings)}
              </p>
            </CardContent>
          </Card>
        </section>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900">Savings summary</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-slate-500">Savings percentage</p>
              <p className="text-lg font-semibold text-slate-900">
                {result.savings.savingsPercentage}%
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Significant savings</p>
              <p className="text-lg font-semibold text-slate-900">
                {result.hasSignificantSavings ? 'Yes' : 'No'}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Summary</p>
              <p className="text-sm font-medium text-slate-700">
                {result.summary ?? 'No narrative summary generated.'}
              </p>
            </div>
          </CardContent>
        </Card>

        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Vendor breakdown</h2>
            <p className="text-sm text-slate-500">
              One recommendation is shown for each submitted vendor.
            </p>
          </div>

          {result.recommendations.map((rec) => (
            <Card key={`${rec.vendorId}-${rec.currentPlan}`} className="border-slate-200">
              <CardContent className="p-5 space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">{rec.vendorName}</h3>
                    <p className="text-sm text-slate-500">
                      Current plan: {rec.currentPlan} · Current spend:{' '}
                      {formatCurrency(rec.currentMonthlySpend)}/mo
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={recommendationTone(rec.recommendationType)}>
                      {RECOMMENDATION_LABELS[rec.recommendationType]}
                    </Badge>
                    <Badge className={confidenceTone(rec.confidence)}>
                      {rec.confidence} confidence
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Recommended action</p>
                    <p className="text-sm font-medium text-slate-800">
                      {getRecommendationTarget(rec)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Monthly savings</p>
                    <p className="text-sm font-semibold text-emerald-700">
                      {formatCurrency(rec.monthlySavings)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Annual savings</p>
                    <p className="text-sm font-semibold text-emerald-700">
                      {formatCurrency(rec.annualSavings)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-slate-700">{rec.reason}</p>
                  {rec.switchingCostNote && (
                    <p className="text-xs text-slate-500">
                      Switching cost: {rec.switchingCostNote}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <div className="mt-6 space-y-4">
          <AuditSummary auditResult={result} />
          <LeadCaptureForm auditId={auditId} />
        </div>
      </div>
    </main>
  )
}

export { ReportSkeleton }
