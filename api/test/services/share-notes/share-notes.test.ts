import assert from 'assert'
import axios from 'axios'
import rest from '@feathersjs/rest-client'
import { FeathersError } from '@feathersjs/errors'
import { v4 as uuidv4 } from 'uuid'

import { app } from '../../../src/app'
import { createClient } from '../../../src/client'
import type { User } from '../../../src/client'

const appUrl = `http://${app.get('host')}:${app.get('port')}`

const users: User[] = []
const password = 'supasecret'

const clients = [
  createClient(rest(appUrl).axios(axios)),
  createClient(rest(appUrl).axios(axios)),
  createClient(rest(appUrl).axios(axios))
]

describe('share-notes service', () => {
  before(async () => {
    let i = 0
    for (const client of clients) {
      const userData = {
        username: `test-share-notes-${i}@denisonweb.com`,
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

  it('users can share notes with other users', async () => {
    const title = `Test note ${uuidv4()}`
    const body = 'Test body of the test note'
    const note = await clients[0].service('notes').create({ title, body })
    const { total: initialTotal } = await clients[1].service('notes').find({})
    await clients[0].service('share-notes').create({ noteId: note.id, userId: users[1].id })
    const { total, data } = await clients[1].service('notes').find({})

    assert.equal(initialTotal, 0)
    assert.equal(total, 1)
    assert.equal(note.id, data[0].id)
  })

  it('users can get individually shared notes', async () => {
    const title = `Test note ${uuidv4()}`
    const body = 'Test body of the test note'
    const note = await clients[0].service('notes').create({ title, body })
    await clients[0].service('share-notes').create({ noteId: note.id, userId: users[1].id })
    const sharedNote = await clients[1].service('notes').get(note.id)

    assert.equal(note.id, sharedNote.id)
  })

  it('users can share the same note with multiple other users', async () => {
    const title = `Test note ${uuidv4()}`
    const body = 'Test body of the test note'
    const note = await clients[0].service('notes').create({ title, body })
    const { total: initialTotal1 } = await clients[1].service('notes').find({})
    const { total: initialTotal2 } = await clients[2].service('notes').find({})

    await clients[0].service('share-notes').create({ noteId: note.id, userId: users[1].id })
    await clients[0].service('share-notes').create({ noteId: note.id, userId: users[2].id })
    const { total: finalTotal1, data: finalData1 } = await clients[1].service('notes').find({})
    const { total: finalTotal2, data: finalData2 } = await clients[2].service('notes').find({})

    assert.equal(initialTotal1, 2)
    assert.equal(initialTotal2, 0)
    assert.equal(finalTotal1, 3)
    assert.equal(finalTotal2, 1)
    assert.equal(note.id, finalData1[2].id)
    assert.equal(note.id, finalData2[0].id)
  })

  it("users cannot share other users's notes", async () => {
    const title = `Test note ${uuidv4()}`
    const body = 'Test body of the test note'
    const note = await clients[0].service('notes').create({ title, body })
    try {
      await clients[1].service('share-notes').create({ noteId: note.id, userId: users[2].id })
      assert.fail('Should not reach this point')
    } catch (e: unknown) {
      const error = e as FeathersError
      assert.equal(error.code, 403)
    }
  })

  it('users cannot share the same note to the same user more than once', async () => {
    const title = `Test note ${uuidv4()}`
    const body = 'Test body of the test note'
    const note = await clients[0].service('notes').create({ title, body })
    await clients[0].service('share-notes').create({ noteId: note.id, userId: users[1].id })
    try {
      await clients[0].service('share-notes').create({ noteId: note.id, userId: users[1].id })
      assert.fail('Should not reach this point')
    } catch (e: unknown) {
      const error = e as FeathersError
      assert.equal(error.code, 400)
    }
  })

  it('users cannot update share notes', async () => {
    const title = `Test note ${uuidv4()}`
    const body = 'Test body of the test note'
    try {
      await (clients[0].service('share-notes') as any).patch({ title, body }) // eslint-disable-line
      assert.fail('Should not reach this point')
    } catch (e: unknown) {
      const error = e as FeathersError
      assert.equal(error.code, 405)
    }
  })

  it('users cannot find share notes externally', async () => {
    try {
      await clients[0].service('share-notes').find({})
      assert.fail('Should not reach this point')
    } catch (e: unknown) {
      const error = e as FeathersError
      assert.equal(error.code, 405)
    }
  })

  it('users cannot get individual share notes externally', async () => {
    const title = `Test note ${uuidv4()}`
    const body = 'Test body of the test note'
    const note = await clients[0].service('notes').create({ title, body })
    const shareNote = await clients[0].service('share-notes').create({ noteId: note.id, userId: users[1].id })
    try {
      await clients[0].service('share-notes').get(shareNote.id)
      assert.fail('Should not reach this point')
    } catch (e: unknown) {
      const error = e as FeathersError
      assert.equal(error.code, 405)
    }
  })
})
