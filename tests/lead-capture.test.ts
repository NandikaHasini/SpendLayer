import { describe, it, expect } from 'vitest'

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

function normalizeOptionalString(value?: string): string | null {
  if (!value) return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function validateLeadInput(input: {
  email: string
  company?: string
  role?: string
  teamSize?: number
  auditId: string
}): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!isValidEmail(input.email)) {
    errors.push('Invalid email address')
  }

  if (
    input.teamSize !== undefined &&
    (input.teamSize < 1 || !Number.isInteger(input.teamSize))
  ) {
    errors.push('Team size must be a positive integer')
  }

  if (!input.auditId || input.auditId.trim().length === 0) {
    errors.push('Audit ID is required')
  }

  return { valid: errors.length === 0, errors }
}

describe('Lead input validation', () => {
  it('accepts valid lead input with all fields', () => {
    const result = validateLeadInput({
      email: 'founder@startup.com',
      company: 'Acme',
      role: 'CTO',
      teamSize: 5,
      auditId: 'abc123',
    })
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('accepts valid lead input without optional fields', () => {
    const result = validateLeadInput({
      email: 'user@example.com',
      auditId: 'xyz789',
    })
    expect(result.valid).toBe(true)
  })

  it('accepts valid lead without teamSize', () => {
    const result = validateLeadInput({
      email: 'user@example.com',
      company: 'Startup',
      role: 'Founder',
      auditId: 'abc123',
    })
    expect(result.valid).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = validateLeadInput({
      email: 'not-an-email',
      auditId: 'abc123',
    })
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Invalid email address')
  })

  it('rejects zero team size when provided', () => {
    const result = validateLeadInput({
      email: 'user@example.com',
      teamSize: 0,
      auditId: 'abc123',
    })
    expect(result.valid).toBe(false)
  })

  it('rejects negative team size when provided', () => {
    const result = validateLeadInput({
      email: 'user@example.com',
      teamSize: -1,
      auditId: 'abc123',
    })
    expect(result.valid).toBe(false)
  })

  it('rejects empty audit ID', () => {
    const result = validateLeadInput({
      email: 'user@example.com',
      auditId: '',
    })
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Audit ID is required')
  })

  it('validates email format strictly', () => {
    expect(isValidEmail('a@b.c')).toBe(true)
    expect(isValidEmail('@nodomain.com')).toBe(false)
    expect(isValidEmail('noatsign.com')).toBe(false)
    expect(isValidEmail('double@@domain.com')).toBe(false)
  })

  it('trims email before validation', () => {
    expect(isValidEmail('  user@example.com  ')).toBe(true)
  })
})

describe('normalizeOptionalString', () => {
  it('returns null for empty string', () => {
    expect(normalizeOptionalString('')).toBeNull()
  })

  it('returns null for whitespace-only string', () => {
    expect(normalizeOptionalString('   ')).toBeNull()
  })

  it('returns null for undefined', () => {
    expect(normalizeOptionalString(undefined)).toBeNull()
  })

  it('returns trimmed string for valid input', () => {
    expect(normalizeOptionalString('  Acme  ')).toBe('Acme')
  })

  it('returns value as-is when already trimmed', () => {
    expect(normalizeOptionalString('Founder')).toBe('Founder')
  })
})
