import { app } from './app'
import { logger } from './logger'
import { seedInitialusers } from './scripts/seed-initial-users'

const port = app.get('port')
const host = app.get('host')

process.on('unhandledRejection', (reason) => logger.error('Unhandled Rejection %O', reason))

seedInitialusers(app)
  .then(() => {
    return app.listen(port)
  })
  .then(() => {
    logger.info(`Supanotes listening on http://${host}:${port}`)
  })
