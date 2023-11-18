// For more information about this file see https://dove.feathersjs.com/guides/cli/service.test.html
import assert from 'assert'
import axios from 'axios'
import rest from '@feathersjs/rest-client'
import { FeathersError } from '@feathersjs/errors'

import { app } from '../src/app'
import { createClient } from '../src/client'
import type { User } from '../src/client'

const appUrl = `http://${app.get('host')}:${app.get('port')}`

const users: User[] = []
const password = 'supasecret'
const { limit } = app.get('rateLimits')

const clients = [createClient(rest(appUrl).axios(axios)), createClient(rest(appUrl).axios(axios))]

describe('rate limit hook', () => {
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

  it('should allow requests under the rate limit', async () => {
    for (let i = 0; i < limit - 1; i++) {
      const response = await clients[0].service('notes').find({})
      assert.ok(response, 'Response received')
    }
  })

  it('should throw a rate limit error after exceeding the limit', async () => {
    try {
      for (let i = 0; i < limit + 1; i++) {
        await clients[0].service('notes').find({})
      }
      assert.fail('Should not reach this point')
    } catch (e: unknown) {
      const error = e as FeathersError
      assert.equal(error.code, 429)
    }
  })
})
