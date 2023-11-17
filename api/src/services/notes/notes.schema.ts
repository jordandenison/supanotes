// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { NoteService } from './notes.class'

// Main data model schema
export const noteSchema = Type.Object(
  {
    id: Type.Number(),
    text: Type.String()
  },
  { $id: 'Note', additionalProperties: false }
)
export type Note = Static<typeof noteSchema>
export const noteValidator = getValidator(noteSchema, dataValidator)
export const noteResolver = resolve<Note, HookContext<NoteService>>({})

export const noteExternalResolver = resolve<Note, HookContext<NoteService>>({})

// Schema for creating new entries
export const noteDataSchema = Type.Pick(noteSchema, ['text'], {
  $id: 'NoteData'
})
export type NoteData = Static<typeof noteDataSchema>
export const noteDataValidator = getValidator(noteDataSchema, dataValidator)
export const noteDataResolver = resolve<Note, HookContext<NoteService>>({})

// Schema for updating existing entries
export const notePatchSchema = Type.Partial(noteSchema, {
  $id: 'NotePatch'
})
export type NotePatch = Static<typeof notePatchSchema>
export const notePatchValidator = getValidator(notePatchSchema, dataValidator)
export const notePatchResolver = resolve<Note, HookContext<NoteService>>({})

// Schema for allowed query properties
export const noteQueryProperties = Type.Pick(noteSchema, ['id', 'text'])
export const noteQuerySchema = Type.Intersect(
  [
    querySyntax(noteQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type NoteQuery = Static<typeof noteQuerySchema>
export const noteQueryValidator = getValidator(noteQuerySchema, queryValidator)
export const noteQueryResolver = resolve<NoteQuery, HookContext<NoteService>>({})
