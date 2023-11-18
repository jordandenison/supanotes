import type { Application } from '../declarations'
import { shareNote } from './share-notes/share-notes'
import { note } from './notes/notes'
import { user } from './users/users'
// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions

export const services = (app: Application) => {
  app.configure(shareNote)
  app.configure(note)
  app.configure(user)
  // All services will be registered here
}
