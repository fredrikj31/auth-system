import Fastify, { FastifyInstance } from "fastify";
import { routes } from "./routes";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { swaggerConfig, swaggerUiConfig } from "./plugins/swagger";
import { databasePlugin } from "./services/database/client";
import { config } from "./config";
import { logger } from "./logging";
import { BaseError } from "./errors";
import fastifyCors from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";

const app: FastifyInstance = Fastify({
  logger: true,
});

app
  .register(fastifySwagger, swaggerConfig)
  .register(fastifySwaggerUi, swaggerUiConfig)
  .register(fastifyCors, {
    origin: config.website.baseUrl,
    methods: ["GET", "POST"],
    maxAge: 86400,
    credentials: true,
  })
  .register(fastifyCookie, {
    secret: config.cookieSecret,
    algorithm: "sha256",
    parseOptions: {
      path: "/",
      httpOnly: true,
      signed: true,
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
    app.register(routes);
  });

app.setErrorHandler((error, _, res) => {
  // Catch all BaseErrors and send back their payload
  if (error instanceof BaseError) {
    return res.status(error.statusCode).send(error.toJSON());
  }

  // If any other error occurs, catch it and return a fixed error message
  logger.fatal({ error }, "Unknown error occurred");
  return res.status(500).send({
    code: "unknown-error",
    message: "An unknown error occurred",
  });
});

app.listen({ port: 3000, host: "0.0.0.0" }, (err: Error | null) => {
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
