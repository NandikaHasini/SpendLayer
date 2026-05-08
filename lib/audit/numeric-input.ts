export function parseOptionalIntegerInput(value: string): number | undefined {
  const trimmed = value.trim()
  if (trimmed === '') return undefined

  const parsed = Number.parseInt(trimmed, 10)
  return Number.isNaN(parsed) ? undefined : parsed
}

export function parseOptionalMoneyInput(value: string): number | undefined {
  const trimmed = value.trim()
  if (trimmed === '') return undefined

  const parsed = Number.parseFloat(trimmed)
  return Number.isNaN(parsed) ? undefined : parsed
}

export function numberInputValue(value: number | undefined): string {
  return value === undefined ? '' : String(value)
}
