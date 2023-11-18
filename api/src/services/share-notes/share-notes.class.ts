// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'
import { BaseService } from '../base-service'

import type { Application } from '../../declarations'
import type { ShareNote, ShareNoteData, ShareNoteQuery } from './share-notes.schema'

export type { ShareNote, ShareNoteData, ShareNoteQuery }

export interface ShareNoteParams extends KnexAdapterParams<ShareNoteQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class ShareNoteService<ServiceParams extends Params = ShareNoteParams> extends BaseService<
  ShareNote,
  ShareNoteData,
  ShareNoteParams,
  undefined
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'share_notes'
  }
}
