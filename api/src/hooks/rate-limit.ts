import type { HookContext } from '@feathersjs/feathers'
import { TooManyRequests } from '@feathersjs/errors'

const attempts: Record<string, Record<string, number>> = {}

export const rateLimit = async (context: HookContext): Promise<void> => {
  const { limit, timeFrame } = context.app.get('rateLimits')
  const { method, path, params } = context

  if (params.user) {
    const key = `${params.user.id}:${method}:${path}`

    if (!attempts[key]) {
      attempts[key] = { count: 1, timestamp: Date.now() }
    } else {
      const attempt = attempts[key]

      if (Date.now() - attempt.timestamp < timeFrame) {
        attempt.count++
        if (attempt.count > limit) {
          throw new TooManyRequests('Rate limit exceeded')
        }
      } else {
        attempts[key] = { count: 1, timestamp: Date.now() }
      }
    }
  }
}
