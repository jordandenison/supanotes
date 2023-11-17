import type { Application } from '../declarations'

import { initialUsers } from '../data/initial-users'

export const seedInitialusers = async (app: Application) => {
  if (process.env.NODE_ENV === 'production') {
    return
  }

  const { total } = await app.service('users').find({})

  if (!total) {
    for (const user of initialUsers) {
      try {
        console.log(`Creating user ${user.username}`)
        await app.service('users').create(user)
        console.log(`Successfully created user ${user.username}`)
      } catch (e: unknown) {
        console.error(`Could not create user ${user.username}, error: ${(e as Error).stack}`)
      }
    }
  }
}
