import { FastifyDynamicSwaggerOptions } from "@fastify/swagger";
import { FastifySwaggerUiOptions } from "@fastify/swagger-ui";
import { jsonSchemaTransform } from "fastify-type-provider-zod";

export const swaggerUiConfig: FastifySwaggerUiOptions = {
  routePrefix: "/docs",
  logo: {
    content: "",
    type: "",
  },
};

export const swaggerConfig: FastifyDynamicSwaggerOptions = {
  mode: "dynamic",
  swagger: {
    info: {
      title: "Auth System",
      description: "A simple authentication/authorization system",
      version: "0.0.1",
    },
    externalDocs: {
      url: "https://github.com/fredrikj31/auth-system",
      description: "Find more info here",
    },
    host: "localhost",
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
    securityDefinitions: {
      jwt: {
        type: "apiKey",
        name: "Authorization",
        in: "header",
      },
    },
  },
  transform: jsonSchemaTransform,
};
