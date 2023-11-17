// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('notes', (table) => {
    table.uuid('id').primary()

    table.string('title').unique()
    table.text('body')
    table.uuid('userId').references('id').inTable('users').notNullable().index().onDelete('CASCADE')

    table.timestamp('createdAt').notNullable()
    table.timestamp('updatedAt').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('notes')
}
