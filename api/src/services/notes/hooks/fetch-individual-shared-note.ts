import type { HookContext } from '../../../declarations'

export const fetchIndividualSharedNote = async (context: HookContext) => {
  if (context.params.user && context.id) {
    const { total } = await context.app
      .service('share-notes')
      .find({ query: { noteId: String(context.id), userId: context.params.user.id } })

    if (total) {
      const knex = context.app.get('postgresqlClient')
      context.result = await knex('notes').where('id', context.id).first()
    }
  }
}
