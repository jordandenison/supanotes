// For more information about this file see https://dove.feathersjs.com/guides/cli/databases.html
import knex, { type Knex } from 'knex'
import { knexSnakeCaseMappers } from 'objection'
import type { Application } from './declarations'

declare module './declarations' {
  interface Configuration {
    postgresqlClient: Knex
  }
}

export const postgresql = (app: Application) => {
  const config = app.get('postgresql')
  const db = knex(
    Object.assign(config!, {
      ...knexSnakeCaseMappers()
    })
  )

  app.set('postgresqlClient', db)
}
