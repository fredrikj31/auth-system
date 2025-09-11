import { FastifyDynamicSwaggerOptions } from "@fastify/swagger";
import { jsonSchemaTransform } from "fastify-type-provider-zod";

export const swaggerConfig: FastifyDynamicSwaggerOptions = {
  mode: "dynamic",
  openapi: {
    openapi: "3.0.0",
    info: {
      title: "Auth System",
      description: "A simple authentication/authorization system",
      version: "0.0.1",
    },
    externalDocs: {
      url: "https://github.com/fredrikj31/auth-system",
      description: "Find more info here",
    },
    servers: [
      {
        url: "http://127.0.0.1:3000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        jwt: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          summary: "Access Token",
          description: "Provided access token from when you logged in",
        },
      },
    },
  },
  transform: jsonSchemaTransform,
};
