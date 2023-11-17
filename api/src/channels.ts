// For more information about this file see https://dove.feathersjs.com/guides/cli/channels.html
import type { Params } from '@feathersjs/feathers'
import '@feathersjs/transport-commons'
import type { Application } from './declarations'

export const channels = (app: Application) => {
  app.on('login', (_, { connection }: Params) => {
    if (connection?.user) {
      app.channel(connection.user.id).join(connection)
    }
  })
}
