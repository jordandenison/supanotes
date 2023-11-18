// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { ShareNoteService } from './share-notes.class'

// Main data model schema
export const shareNoteSchema = Type.Object(
  {
    id: Type.String({ format: 'uuid' }),
    noteId: Type.String({ format: 'uuid' }),
    userId: Type.String({ format: 'uuid' })
  },
  { $id: 'ShareNote', additionalProperties: false }
)
export type ShareNote = Static<typeof shareNoteSchema>
export const shareNoteValidator = getValidator(shareNoteSchema, dataValidator)
export const shareNoteResolver = resolve<ShareNote, HookContext<ShareNoteService>>({})

export const shareNoteExternalResolver = resolve<ShareNote, HookContext<ShareNoteService>>({})

// Schema for creating new entries
export const shareNoteDataSchema = Type.Object(
  {
    id: Type.Optional(Type.String({ format: 'uuid' })),
    noteId: Type.String({ format: 'uuid' }),
    userId: Type.String({ format: 'uuid' })
  },
  { $id: 'ShareNoteData', additionalProperties: false }
)
export type ShareNoteData = Static<typeof shareNoteDataSchema>
export const shareNoteDataValidator = getValidator(shareNoteDataSchema, dataValidator)
export const shareNoteDataResolver = resolve<ShareNote, HookContext<ShareNoteService>>({})

// Schema for allowed query properties
export const shareNoteQueryProperties = Type.Pick(shareNoteSchema, ['id', 'noteId', 'userId'])
export const shareNoteQuerySchema = Type.Intersect(
  [
    querySyntax(shareNoteQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type ShareNoteQuery = Static<typeof shareNoteQuerySchema>
export const shareNoteQueryValidator = getValidator(shareNoteQuerySchema, queryValidator)
export const shareNoteQueryResolver = resolve<ShareNoteQuery, HookContext<ShareNoteService>>({})
