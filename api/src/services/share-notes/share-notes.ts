// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'
import { hooks as schemaHooks } from '@feathersjs/schema'
import { createSwaggerServiceOptions } from 'feathers-swagger'

import type { Application } from '../../declarations'
import { disableExternal } from '../../hooks/disable'
import {
  shareNoteDataValidator,
  shareNoteQueryValidator,
  shareNoteResolver,
  shareNoteExternalResolver,
  shareNoteDataResolver,
  shareNoteQueryResolver,
  shareNoteSchema,
  shareNoteDataSchema,
  shareNoteQuerySchema
} from './share-notes.schema'

import { ShareNoteService, getOptions } from './share-notes.class'
import { shareNotePath, shareNoteMethods } from './share-notes.shared'

import { preventUnauthorizedSharing } from './hooks/prevent-unauthorized-sharing'

export * from './share-notes.class'
export * from './share-notes.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const shareNote = (app: Application) => {
  // Register our service on the Feathers application
  app.use(shareNotePath, new ShareNoteService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: shareNoteMethods,
    // You can add additional custom events to be sent to clients here
    events: [],
    docs: createSwaggerServiceOptions({
      schemas: { shareNoteSchema, shareNoteDataSchema, shareNoteQuerySchema }
    })
  })
  // Initialize hooks
  app.service(shareNotePath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(shareNoteExternalResolver),
        schemaHooks.resolveResult(shareNoteResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(shareNoteQueryValidator),
        schemaHooks.resolveQuery(shareNoteQueryResolver)
      ],
      find: [disableExternal],
      get: [disableExternal],
      create: [
        schemaHooks.validateData(shareNoteDataValidator),
        schemaHooks.resolveData(shareNoteDataResolver),
        preventUnauthorizedSharing
      ],
      patch: [disableExternal],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [shareNotePath]: ShareNoteService
  }
}
