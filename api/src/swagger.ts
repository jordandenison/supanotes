import swagger from 'feathers-swagger'
import type { ServiceSwaggerOptions } from 'feathers-swagger'

declare module '@feathersjs/feathers' {
  interface ServiceOptions {
    docs?: ServiceSwaggerOptions
  }
}

export const getSwaggerConfig = () => {
  return swagger({
    specs: {
      info: {
        title: 'Supanotes API documentation',
        description: 'A simple note creating and sharing API',
        version: '0.0.2'
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
}