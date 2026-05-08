import { AuditForm } from '@/components/forms/AuditForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Audit Your AI Spend | SpendLayer',
  description:
    'Enter your AI tooling stack and get a free, deterministic spend audit with real savings recommendations.',
  openGraph: {
    title: 'Audit Your AI Spend | SpendLayer',
    description:
      'Enter your AI tooling stack and get a free, deterministic spend audit with real savings recommendations.',
  },
}

export default function AuditPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Audit Your AI Spend
          </h1>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Takes 2 minutes. No account required. Built on verified pricing data
            - not AI guesswork.
          </p>
        </div>

        <AuditForm />
      </div>
    </main>
  )
}
