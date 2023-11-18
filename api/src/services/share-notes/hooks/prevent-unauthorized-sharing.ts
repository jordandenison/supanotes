import { Forbidden } from '@feathersjs/errors'
import type { HookContext } from '../../../declarations'

export const preventUnauthorizedSharing = async (context: HookContext) => {
  if (context.params.user) {
    const note = await context.app.service('notes').get(context.data.noteId)
    if (note.userId !== context.params.user.id) {
      throw new Forbidden()
    }
  }
}
