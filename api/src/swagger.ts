import swagger from 'feathers-swagger'
import type { ServiceSwaggerOptions } from 'feathers-swagger'

declare module '@feathersjs/feathers' {
  interface ServiceOptions {
    docs?: ServiceSwaggerOptions
  }
}

export const getSwaggerConfig = () => {
  return swagger({
    idType: 'string',
    specs: {
      security: [{ BearerAuth: [] }],
      info: {
        title: 'Supanotes API documentation',
        description: 'A simple note creating and sharing API',
        version: '1.1.3'
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
                          $ref: '#/components/schemas/User'
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
          }
        }
      }
    },
    ui: swagger.swaggerUI({}) // eslint-disable-line
  })
}
