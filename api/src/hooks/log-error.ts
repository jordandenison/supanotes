// For more information about this file see https://dove.feathersjs.com/guides/cli/log-error.html
import type { HookContext, NextFunction } from '../declarations'
import { logger } from '../logger'

export const logError = async (context: HookContext, next: NextFunction) => {
  try {
    await next()
    // eslint-disable-next-line
  } catch (error: any) {
    if (error.stack) {
      logger.error(error.stack.slice(0, 500))
    }

    // Log validation errors
    if (error.data) {
      logger.error('Data: %O', error.data)
    }

    if (error.message === 'Request failed with status code 401') {
      error.toJSON = () => ({})
    }

    throw error
  }
}
