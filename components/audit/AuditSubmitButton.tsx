'use client'

import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface AuditSubmitButtonProps {
  isSubmitting: boolean
  disabled?: boolean
  label?: string
}

export function AuditSubmitButton({
  isSubmitting,
  disabled,
  label = 'Generate Audit',
}: AuditSubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={disabled || isSubmitting}
      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6"
    >
      {isSubmitting ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Generating audit...
        </>
      ) : (
        label
      )}
    </Button>
  )
}
