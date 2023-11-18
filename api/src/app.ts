// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html
import { feathers } from '@feathersjs/feathers'
import configuration from '@feathersjs/configuration'
import { koa, rest, bodyParser, errorHandler, parseAuthentication, cors, serveStatic } from '@feathersjs/koa'
import socketio from '@feathersjs/socketio'

import swagger from 'feathers-swagger'
import { configurationValidator } from './configuration'
import type { Application } from './declarations'
import { logError } from './hooks/log-error'
import { postgresql } from './postgresql'
import { authentication } from './authentication'
import { services } from './services/index'
import { channels } from './channels'

const app: Application = koa(feathers())

// Load our app configuration (see config/ folder)
app.configure(configuration(configurationValidator))

// Set up Koa middleware
app.use(cors())
app.use(serveStatic(app.get('public')))
app.use(errorHandler())
app.use(parseAuthentication())
app.use(bodyParser())

// Configure services and transports
app.configure(rest())
app.configure(
  socketio({
    cors: {
      origin: app.get('origins')
    }
  })
)
app.configure(authentication)
app.configure(
  swagger({
    specs: {
      info: {
        title: 'Supanotes API documentation',
        description: 'A simple note creating and sharing API',
        version: '0.0.1'
      },
      tags: [
        {
          name: 'authentication',
          description: 'Authentication related operations'
        },
        {
          name: 'notes',
          description: 'A service for managing notes'
        },
        {
          name: 'share-notes',
          description: 'A service for sharing notes with other users'
        },
        {
          name: 'users',
          description: 'A service for managing users'
        }
      ],
      security: [{ BearerAuth: [] }],
      paths: {
        '/authentication': {
          post: {
            tags: ['authentication'],
            summary: 'Authenticate a user',
            requestBody: {
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/authentication'
                  }
                }
              }
            },
            responses: {
              '201': {
                description: 'Authentication successful',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        accessToken: { type: 'string' },
                        authentication: {
                          type: 'object',
                          properties: {
                            strategy: { type: 'string' },
                            payload: {
                              type: 'object',
                              properties: {
                                iat: { type: 'integer' },
                                exp: { type: 'integer' },
                                aud: { type: 'string' },
                                sub: { type: 'string' },
                                jti: { type: 'string' }
                              }
                            }
                          }
                        },
                        user: {
                          $ref: '#/components/schemas/user'
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        },
        schemas: {
          authentication: {
            type: 'object',
            properties: {
              strategy: {
                type: 'string',
                enum: ['local', 'jwt']
              },
              username: { type: 'string' },
              password: { type: 'string' }
            },
            required: ['strategy', 'username', 'password']
          },
          user: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              username: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' }
            }
          }
        }
      }
    },
    ui: swagger.swaggerUI({}) // eslint-disable-line
  })
)
app.configure(postgresql)
app.configure(services)
app.configure(channels)

// Register hooks that run on all service methods
app.hooks({
  around: {
    all: [logError]
  },
  after: {},
  error: {}
})
// Register application setup and teardown hooks here
app.hooks({
  setup: [],
  teardown: []
})

export { app }
