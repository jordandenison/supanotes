import assert from 'assert'
import axios from 'axios'
import rest from '@feathersjs/rest-client'
import { FeathersError } from '@feathersjs/errors'
import { v4 as uuidv4 } from 'uuid'

import { app } from '../../../src/app'
import { createClient } from '../../../src/client'
import type { NoteData, User } from '../../../src/client'

const appUrl = `http://${app.get('host')}:${app.get('port')}`

const users: User[] = []
const password = 'supasecret'

const clients = [createClient(rest(appUrl).axios(axios)), createClient(rest(appUrl).axios(axios))]

describe('notes service', () => {
  before(async () => {
    let i = 0
    for (const client of clients) {
      const userData = {
        username: `test-notes-${i}@denisonweb.com`,
        password
      }

      const user = await client.service('users').create(userData)
      users.push(user)

      await client.authenticate({
        strategy: 'local',
        ...userData
      })
      i++
    }
  })

  after(async () => {
    for (let i = 0; i < clients.length; i++) {
      await clients[i].service('users').remove(users[i].id)
    }
  })

  it('registered the service', () => {
    const service = app.service('notes')

    assert.ok(service, 'Registered the service')
  })

  it('creates a note with title and body', async () => {
    const title = `Test note ${uuidv4()}`
    const body = 'Test body of the test note'
    const note = await clients[0].service('notes').create({ title, body })

    assert.equal(note.title, title)
    assert.equal(note.body, body)
  })

  it('creates a note with id', async () => {
    const id = uuidv4()
    const title = `Test note ${id}`
    const body = 'Test body of the test note'
    const note = await clients[0].service('notes').create({ id, title, body })

    assert.equal(note.id, id)
  })

  it("creates a note with the creating user's id", async () => {
    const title = `Test note ${uuidv4()}`
    const body = 'Test body of the test note'
    const note = await clients[0].service('notes').create({ title, body })

    assert.equal(note.userId, users[0].id)
  })

  it('users can get own notes', async () => {
    const title = `Test note ${uuidv4()}`
    const body = 'Test body of the test note'
    const note = await clients[0].service('notes').create({ title, body })

    const fetchedNote = await clients[0].service('notes').get(note.id)
    assert.equal(note.id, fetchedNote.id)
  })

  it('users can find own notes', async () => {
    const title = `Test note ${uuidv4()}`
    const body = 'Test body of the test note'
    await clients[0].service('notes').create({ title, body })

    const { total } = await clients[0].service('notes').find({})
    assert.ok(total > 0)
  })

  it("users cannot get other users' notes", async () => {
    const title = `Test note ${uuidv4()}`
    const body = 'Test body of the test note'
    const note = await clients[0].service('notes').create({ title, body })

    try {
      await clients[1].service('notes').get(note.id)
      assert.fail('Should not reach this point')
    } catch (e: unknown) {
      const error = e as FeathersError
      assert.equal(error.code, 404)
    }
  })

  it("users cannot find other users' notes", async () => {
    const title = `Test note ${uuidv4()}`
    const body = 'Test body of the test note'
    await clients[0].service('notes').create({ title, body })

    const { total } = await clients[1].service('notes').find({})
    assert.equal(total, 0)
  })

  it("users cannot create a note on another user's behalf", async () => {
    const title = `Test note ${uuidv4()}`
    const body = 'Test body of the test note'
    const userId = users[1].id

    try {
      await clients[0].service('notes').create({ title, body, userId } as NoteData)
      assert.fail('Should not reach this point')
    } catch (e: unknown) {
      const error = e as FeathersError
      assert.equal(error.code, 400)
    }
  })

  it("users can edit a note's title", async () => {
    const title = `Test note ${uuidv4()}`
    const body = 'Test body of the test note'
    const note = await clients[0].service('notes').create({ title, body })
    const newTitle = `New test note ${uuidv4()} title`
    const patchedNote = await clients[0].service('notes').patch(note.id, { title: newTitle })

    assert.equal(patchedNote.title, newTitle)
  })

  it("users can edit a note's title", async () => {
    const title = `Test note ${uuidv4()}`
    const body = 'Test body of the test note'
    const note = await clients[0].service('notes').create({ title, body })
    const newBody = `New test note body`
    const patchedNote = await clients[0].service('notes').patch(note.id, { body: newBody })

    assert.equal(patchedNote.body, newBody)
  })

  it('throws an error when title is missing', async () => {
    try {
      await app.service('notes').create({ body: 'This note has no title.' } as NoteData)
      assert.fail('Should not reach this point')
    } catch (e: unknown) {
      const error = e as FeathersError
      assert.equal(error.code, 400)
      assert.ok(error.data[0].message.includes('title'))
    }
  })

  it('throws an error when title is over 100 characters', async () => {
    const title = Array.from({ length: 101 }, () => '0').join('')
    const body = 'Test body of the test note'
    try {
      await clients[0].service('notes').create({ title, body } as NoteData)
      assert.fail('Should not reach this point')
    } catch (e: unknown) {
      const error = e as FeathersError
      assert.equal(error.code, 400)
      assert.equal(error.data[0].message, 'must NOT have more than 100 characters')
    }
  })

  it('throws an error when body is over 5000 characters', async () => {
    const title = `Test note ${uuidv4()}`
    const body = Array.from({ length: 5001 }, () => '0').join('')
    try {
      await clients[0].service('notes').create({ title, body } as NoteData)
      assert.fail('Should not reach this point')
    } catch (e: unknown) {
      const error = e as FeathersError
      assert.equal(error.code, 400)
      assert.equal(error.data[0].message, 'must NOT have more than 5000 characters')
    }
  })
})
