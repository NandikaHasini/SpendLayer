interface ReportPageProps {
  params: { id: string }
}

export default function ReportPage({ params }: ReportPageProps) {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold text-slate-900">Report</h1>
        <p className="font-mono text-sm text-slate-400">{params.id}</p>
        <p className="text-slate-500">Phase 6</p>
      </div>
    </main>
  )
}
