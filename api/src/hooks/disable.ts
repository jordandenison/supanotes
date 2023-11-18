import { MethodNotAllowed } from '@feathersjs/errors/lib'
import type { HookContext } from '../declarations'

export const disableExternal = async (context: HookContext) => {
  if (context.params.provider) {
    throw new MethodNotAllowed()
  }
}
