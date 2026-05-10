export function isLikelyBotLead(honeypotValue?: string | null): boolean {
  return typeof honeypotValue === 'string' && honeypotValue.trim().length > 0
}
