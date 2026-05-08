import { ReportView } from '@/components/audit/ReportView'

interface ReportPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { id } = await params

  return <ReportView auditId={id} />
}
