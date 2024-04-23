import { createSwaggerSpec } from "next-swagger-doc";

import "server-only";

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: "app/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Prep-Intel API",
        version: "1.0.1",
      },
      servers: [
        {
          url: "http://localhost:3000/",
          description: "Local development",
        },
        {
            url: "http://prep-intele-development.cluster-c7ao62sg4xma.us-east-1.rds.amazonaws.com/",
            description: "AWS dev",
          },

      ],
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
        schemas: {
          School: {
            type: "object",
            properties: {
              id: {
                type: "integer",
                format: "int64",
                description: "Unique identifier for the school.",
              },
              name: {
                type: "string",
                description: "Name of the school.",
              },
              school_address: {
                type: "object",
                properties: {
                  state: {
                    type: "string",
                    description: "The state where the school is located.",
                  },
                },
              },
            },
          },
        },
      },
      security: [],
    },
  });
  return spec;
};
