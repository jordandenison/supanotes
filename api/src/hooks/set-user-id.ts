import type { HookContext } from '@feathersjs/feathers'

export const setUserId = async (context: HookContext): Promise<void> => {
  if (context.path !== 'users' && context.params.user) {
    context.data.userId = context.params.user.id
  }
}
