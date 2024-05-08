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
            url: "http://prep-intel-dev-alb-1208390994.us-east-1.elb.amazonaws.com/",
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
          "string-array": {
            "type": "array",
            "items": {
              "type": "string",
            }
          },
          "School": {
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
          "Recruiter": {
            "type": "object",
            "properties": {
              "id": {
                "type": "string",
                "description": "The unique identifier for the recruiter"
              },
              "name": {
                "type": "string",
                "description": "The name of the recruiter"
              }
            }
          },
          "student-recruit-response": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "studentId": {
                  "type": "integer",
                  "description": "Unique ID of a student"
                },
                "studentActScore": {
                  "type": "integer",
                  "description": "Student ACT score"
                },
                "studentSatScore": {
                  "type": "integer",
                  "description": "Student SAT score"
                },
                "studentGpa": {
                  "type": "number",
                  "description": "Student GPA"
                },
                "studentGradYear": {
                  "type": "integer",
                  "description": "Student expected graduation year"
                },
                "studentHighSchool": {
                  "type": "string",
                  "description": "Name of the high school student attends"
                },
                "connectionRequestId": {
                  "type": "string",
                  "description": "Unique ID of a connection request"
                },
                "connectionRequestStatus": {
                  "type": "boolean",
                  "description": "Connection request status"
                },
                "requestDate": {
                  "type": "string",
                  "format": "date",
                  "description": "Connection request date"
                }
              }
            }
          },

          "student-connection-response": {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: {
                  type: "integer",
                  description: "Unique ID of a connection request"
                },
                schoolName: {
                  type: "string",
                  description: "School name"
                },
                recruiterName: {
                  type: "string",
                  description: "Name of recruiter who sent request"
                },
                requestDate: {
                  type: "string",
                  format: "date",
                  description: "Connection request date"
                }
              }
            }
          },
        },
      },
      security: [],
    },
  });
  return spec;
};
