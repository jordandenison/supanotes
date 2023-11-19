// For more information about this file see https://dove.feathersjs.com/guides/cli/channels.html
import type { Params } from '@feathersjs/feathers'
import '@feathersjs/transport-commons'
import type { Application } from './declarations'
import type { ShareNote } from './services/share-notes/share-notes.schema'

export const channels = (app: Application) => {
  app.on('login', (_, { connection }: Params) => {
    if (connection?.user) {
      app.channel(connection.user.id).join(connection)
    }
  })

  app.service('share-notes').publish('created', (data: ShareNote) => {
    const shareNote = (Array.isArray(data) ? data[0] : data)
    return app.channel(shareNote.userId)
  })
}
