import { createSwaggerSpec } from "next-swagger-doc"

import "server-only"

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: "app/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Prep-Intel API",
        version: "1.0.1",
      },
      servers: [{
          url: "http://localhost:3000/",
          description: "Local development"
      }
      ],
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [],
    },
  })
  return spec
}
