// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'
import { hooks as schemaHooks } from '@feathersjs/schema'
import { createSwaggerServiceOptions } from 'feathers-swagger'

import type { Application } from '../../declarations'
import { setUserId } from '../../hooks/set-user-id'
import { rateLimit } from '../../hooks/rate-limit'
import {
  noteDataValidator,
  notePatchValidator,
  noteQueryValidator,
  noteResolver,
  noteExternalResolver,
  noteDataResolver,
  notePatchResolver,
  noteQueryResolver,
  noteSchema,
  noteDataSchema,
  notePatchSchema,
  noteQuerySchema
} from './notes.schema'

import { NoteService, getOptions } from './notes.class'
import { notePath, noteMethods } from './notes.shared'

import { fetchIndividualSharedNote } from './hooks/fetch-individual-shared-note'
import { fetchSharedNotes } from './hooks/fetch-shared-notes'

export * from './notes.class'
export * from './notes.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const note = (app: Application) => {
  // Register our service on the Feathers application
  app.use(notePath, new NoteService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: noteMethods,
    // You can add additional custom events to be sent to clients here
    events: [],
    docs: createSwaggerServiceOptions({
      schemas: { noteSchema, noteDataSchema, notePatchSchema, noteQuerySchema },
      docs: {
        securities: ['all']
      }
    })
  })
  // Initialize hooks
  app.service(notePath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(noteExternalResolver),
        schemaHooks.resolveResult(noteResolver)
      ]
    },
    before: {
      all: [
        rateLimit,
        schemaHooks.validateQuery(noteQueryValidator),
        schemaHooks.resolveQuery(noteQueryResolver)
      ],
      find: [],
      get: [fetchIndividualSharedNote],
      create: [
        schemaHooks.validateData(noteDataValidator),
        schemaHooks.resolveData(noteDataResolver),
        setUserId
      ],
      patch: [schemaHooks.validateData(notePatchValidator), schemaHooks.resolveData(notePatchResolver)],
      remove: []
    },
    after: {
      all: [],
      find: [fetchSharedNotes]
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [notePath]: NoteService
  }
}
