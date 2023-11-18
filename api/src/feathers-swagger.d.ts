/* eslint-disable import/no-unused-modules */
import '@feathersjs/feathers'
import type { ServiceSwaggerOptions } from 'feathers-swagger'

declare module '@feathersjs/feathers' {
  interface ServiceOptions {
    docs?: ServiceSwaggerOptions
  }
}
