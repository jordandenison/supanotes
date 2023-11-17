// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Note, NoteData, NotePatch, NoteQuery, NoteService } from './notes.class'

export type { Note, NoteData, NotePatch, NoteQuery }

export type NoteClientService = Pick<NoteService<Params<NoteQuery>>, (typeof noteMethods)[number]>

export const notePath = 'notes'

export const noteMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const noteClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(notePath, connection.service(notePath), {
    methods: noteMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [notePath]: NoteClientService
  }
}
