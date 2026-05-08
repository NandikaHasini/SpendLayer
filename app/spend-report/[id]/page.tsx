import type { Metadata } from 'next'
import { ReportView } from '@/components/audit/ReportView'
import { fetchAuditReportFromSupabase } from '@/lib/report-storage'

interface ReportPageProps {
  params: Promise<{
    id: string
  }>
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: ReportPageProps): Promise<Metadata> {
  const { id } = await params
  const report = await fetchAuditReportFromSupabase(id)

  if (report.ok && report.report) {
    return {
      title: `SpendLayer report - ${id}`,
      description:
        'Deterministic AI spend audit with verified pricing data and savings recommendations.',
      openGraph: {
        title: `SpendLayer report - ${id}`,
        description:
          'Deterministic AI spend audit with verified pricing data and savings recommendations.',
      },
    }
  }

  return {
    title: `SpendLayer report - ${id}`,
    description: 'A deterministic AI spend audit report from SpendLayer.',
  }
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { id } = await params
  const report = await fetchAuditReportFromSupabase(id)

  return (
    <ReportView
      auditId={id}
      initialReport={report.report}
      reportState={report.state}
      reportMessage={report.message}
    />
  )
}
