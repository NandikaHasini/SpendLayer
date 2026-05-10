import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { EmailReportForm } from '@/components/audit/EmailReportForm'

const componentSource = readFileSync(
  join(process.cwd(), 'components/audit/EmailReportForm.tsx'),
  'utf8'
)

const baseProps = {
  totalMonthlySpend: 1200,
  totalPotentialSavings: 300,
  recommendationCount: 4,
  criticalCount: 1,
}

describe('EmailReportForm', () => {
  it('renders the email input and submit button without crashing', () => {
    const html = renderToStaticMarkup(<EmailReportForm {...baseProps} />)

    expect(html).toContain('type="email"')
    expect(html).toContain('Send report')
  })

  it('does not render a validation error before interaction', () => {
    const html = renderToStaticMarkup(<EmailReportForm {...baseProps} />)

    expect(html).not.toContain('Email address is required.')
    expect(html).not.toContain('Please enter a valid email address.')
  })

  it('includes blur handling for empty-input validation', () => {
    expect(componentSource).toContain('onBlur={() => setTouched(true)}')
    expect(componentSource).toContain("return 'Email address is required.'")
  })

  it('validates empty input during submit', () => {
    expect(componentSource).toContain('setTouched(true)')
    expect(componentSource).toContain('const nextValidationError = validateEmail(email)')
  })

  it('validates invalid email format during submit', () => {
    expect(componentSource).toContain('/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/')
    expect(componentSource).toContain('Please enter a valid email address.')
  })

  it('disables input and button and shows loading copy during fetch', () => {
    expect(componentSource).toContain("const isDisabled = formState === 'loading'")
    expect(componentSource).toContain('disabled={isDisabled}')
    expect(componentSource).toContain('aria-busy={formState ===')
    expect(componentSource).toContain('Sending')
    expect(componentSource).toContain('animate-spin')
  })

  it('renders success state with the recipient email', () => {
    expect(componentSource).toContain("setFormState('success')")
    expect(componentSource).toContain('Report sent!')
    expect(componentSource).toContain('email.trim()')
  })

  it('reset button returns the form to idle with empty input', () => {
    expect(componentSource).toContain("setFormState('idle')")
    expect(componentSource).toContain("setEmail('')")
    expect(componentSource).toContain("setTouched(false)")
    expect(componentSource).toContain("setErrorMessage('')")
  })

  it('uses custom API errors when delivery returns success false', () => {
    expect(componentSource).toContain('data.error ??')
    expect(componentSource).toContain('Report could not be sent. Please try again.')
  })

  it('shows fallback error on network exception', () => {
    expect(componentSource).toContain('Unable to deliver the report right now. Your audit results are still saved above.')
  })

  it('preserves email after an error state', () => {
    expect(componentSource).not.toContain("catch {\n      setEmail('')")
    expect(componentSource).not.toContain("setFormState('error')\n      setEmail('')")
  })

  it('does not navigate on error', () => {
    expect(componentSource).not.toContain('window.location.assign')
    expect(componentSource).not.toContain('window.location.replace')
  })

  it('companyName prop is optional and renders without it', () => {
    const html = renderToStaticMarkup(<EmailReportForm {...baseProps} />)

    expect(html).toContain('Email this report')
  })

  it('input has maxLength of 320', () => {
    const html = renderToStaticMarkup(<EmailReportForm {...baseProps} />)

    expect(html).toContain('maxLength="320"')
  })
})
