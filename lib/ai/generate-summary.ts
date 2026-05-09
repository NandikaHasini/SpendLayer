import type { AuditResult } from '@/types/audit'
import { buildFallbackSummary } from './summary-fallback'

export interface SummaryGenerationResult {
  summary: string
  source: 'ai' | 'fallback'
}

export async function generateAuditSummary(
  result: AuditResult
): Promise<SummaryGenerationResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    return {
      summary: buildFallbackSummary(result),
      source: 'fallback',
    }
  }

  const prompt = buildSummaryPrompt(result)

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    let response: Response

    try {
      response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-5-haiku-20241022',
          max_tokens: 200,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
        signal: controller.signal,
      })
    } finally {
      clearTimeout(timeout)
    }

    if (!response.ok) {
      return {
        summary: buildFallbackSummary(result),
        source: 'fallback',
      }
    }

    const data = await response.json()
    const text = data?.content?.[0]?.text

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return {
        summary: buildFallbackSummary(result),
        source: 'fallback',
      }
    }

    return {
      summary: text.trim(),
      source: 'ai',
    }
  } catch {
    return {
      summary: buildFallbackSummary(result),
      source: 'fallback',
    }
  }
}

function buildSummaryPrompt(result: AuditResult): string {
  const {
    totalCurrentSpend,
    totalMonthlySavings,
    totalAnnualSavings,
    recommendations,
  } = result

  const keepCount = recommendations.filter(
    (r) => r.recommendationType === 'KEEP'
  ).length
  const optimizeCount = recommendations.length - keepCount

  return `You are a concise financial advisor summarizing an AI tooling spend audit for a startup founder.

Audit data:
- Current monthly spend: $${totalCurrentSpend}
- Monthly savings identified: $${totalMonthlySavings}
- Annual savings identified: $${totalAnnualSavings}
- Tools reviewed: ${recommendations.length}
- Tools to optimize: ${optimizeCount}
- Tools already efficient: ${keepCount}

Write a 2–3 sentence professional summary of these audit results.
Be direct and founder-friendly.
Do NOT invent savings figures. Use only the numbers provided above.
Do NOT make recommendations beyond what the data shows.
Do NOT use marketing language or hype.`
}
