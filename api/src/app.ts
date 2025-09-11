import Fastify, { FastifyInstance } from "fastify";
import { routes } from "./routes";
import fastifySwagger from "@fastify/swagger";
import { swaggerConfig } from "./plugins/swagger";
import { databasePlugin } from "./services/database/client";
import { config } from "./config";
import { logger } from "./logging";
import { BaseError } from "./errors";
import fastifyCors from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";
import {
  hasZodFastifySchemaValidationErrors,
  isResponseSerializationError,
} from "fastify-type-provider-zod";

const app: FastifyInstance = Fastify({
  logger: true,
});

app
  .register(fastifySwagger, swaggerConfig)
  .register(import("@scalar/fastify-api-reference"), {
    routePrefix: "/docs",
  })
  .register(fastifyCors, {
    origin: config.website.baseUrl,
    methods: ["GET", "POST"],
    maxAge: 86400,
    credentials: true,
  })
  .register(fastifyCookie, {
    parseOptions: {
      path: "/",
      sameSite: true,
    },
  })
  .register(databasePlugin, {
    dbHost: config.database.host,
    dbPort: config.database.port,
    dbUsername: config.database.username,
    dbPassword: config.database.password,
    dbName: config.database.name,
  })
  .after(() => {
    app.register(routes, { prefix: "/api" });
  });

app.setErrorHandler((error, req, res) => {
  // Catch all BaseErrors and send back their payload
  if (error instanceof BaseError) {
    return res.status(error.statusCode).send(error.toJSON());
  }

  // Return validation errors
  if (hasZodFastifySchemaValidationErrors(error)) {
    return res.status(400).send({
      error: "Response Validation Error",
      message: "Request doesn't match the schema",
      statusCode: 400,
      details: {
        issues: error.validation,
        method: req.method,
        url: req.url,
      },
    });
  }

  if (isResponseSerializationError(error)) {
    return res.status(500).send({
      error: "Internal Server Error",
      message: "Response doesn't match the schema",
      statusCode: 500,
      details: {
        issues: error.cause.issues,
        method: error.method,
        url: error.url,
      },
    });
  }

  // If any other error occurs, catch it and return a fixed error message
  logger.fatal({ error }, "Unknown error occurred");
  return res.status(500).send({
    code: "unknown-error",
    message: "An unknown error occurred",
  });
});

app.listen({ host: "0.0.0.0", port: 3000 }, (err: Error | null) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});

process.on("SIGINT", () => {
  app.log.warn(`SIGINT signal detected, terminating service`);
  app.close();
});

process.on("SIGTERM", () => {
  app.log.warn(`SIGTERM signal detected, terminating service`);
  app.close();
});

declare module "fastify" {
  interface FastifyRequest {
    user?: {
      id: string;
    };
  }
}
