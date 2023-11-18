import type { HookContext } from '../../../declarations'
import type { ShareNote } from '../../share-notes/share-notes.schema'

export const fetchSharedNotes = async (context: HookContext) => {
  if (context.params.user) {
    const { data: shareNotes } = await context.app
      .service('share-notes')
      .find({ query: { userId: context.params.user.id } })
    const noteIds = shareNotes.map((shareNote: ShareNote): string => shareNote.noteId)
    const knex = context.app.get('postgresqlClient')
    const fetchedSharedNotes = await knex('notes').whereIn('id', noteIds)

    context.result.data = [...context.result.data, ...fetchedSharedNotes]
    context.result.total += fetchedSharedNotes.length
  }
}
