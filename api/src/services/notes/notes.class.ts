// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Note, NoteData, NotePatch, NoteQuery } from './notes.schema'

export type { Note, NoteData, NotePatch, NoteQuery }

export interface NoteParams extends KnexAdapterParams<NoteQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class NoteService<ServiceParams extends Params = NoteParams> extends KnexService<
  Note,
  NoteData,
  NoteParams,
  NotePatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'notes'
  }
}
