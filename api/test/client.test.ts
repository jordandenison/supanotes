import assert from 'assert'
import axios from 'axios'

import rest from '@feathersjs/rest-client'
import { app } from '../src/app'
import { createClient } from '../src/client'
import type { UserData } from '../src/client'

const appUrl = `http://${app.get('host')}:${app.get('port')}`

describe('application client tests', () => {
  const client = createClient(rest(appUrl).axios(axios))

  it('initialized the client', () => {
    assert.ok(client)
  })

  it('creates and authenticates a user with email and password', async () => {
    const userData: UserData = {
      username: 'test-client@denisonweb.com',
      password: 'supasecret'
    }

    await client.service('users').create(userData)

    const { user, accessToken } = await client.authenticate({
      strategy: 'local',
      ...userData
    })

    assert.ok(accessToken, 'Created access token for user')
    assert.ok(user, 'Includes user in authentication data')
    assert.strictEqual(user.password, undefined, 'Password is hidden to clients')

    await client.logout()

    await app.service('users').remove(user.id)
  })
})
