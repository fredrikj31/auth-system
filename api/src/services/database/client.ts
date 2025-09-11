import { FastifyInstance } from "fastify";
import { fastifyPlugin } from "fastify-plugin";
import {
  CommonQueryMethods,
  createBigintTypeParser,
  createIntervalTypeParser,
  createNumericTypeParser,
  createPool,
  Interceptor,
  QueryResultRow,
  SchemaValidationError,
} from "slonik";
import { createFieldNameTransformationInterceptor } from "slonik-interceptor-field-name-transformation";
import { logger } from "../../logging";
import z from "zod";

interface DatabasePluginOptions {
  dbUsername: string;
  dbPassword: string;
  dbHost: string;
  dbPort: string;
  dbName: string;
}

const database = async (
  fastify: FastifyInstance,
  opts: DatabasePluginOptions,
) => {
  try {
    const pool = await createPool(
      `postgresql://${opts.dbUsername}:${opts.dbPassword}@${opts.dbHost}:${opts.dbPort}/${opts.dbName}`,
      {
        interceptors: [
          createFieldNameTransformationInterceptor({
            test: (field) => {
              return (
                field.name !== "__typename" && /^[\d_a-z]+$/u.test(field.name)
              );
            },
          }),
          zodParserInterceptor(),
        ],
        typeParsers: [
          createBigintTypeParser(),
          createIntervalTypeParser(),
          createNumericTypeParser(),
          customTimestampParser,
        ],
      },
    );
    fastify.decorate("database", pool);
  } catch (error: unknown) {
    logger.fatal(error, "Unable to connect to database");
    throw new Error("Unable to connect to database!");
  }
};
export const databasePlugin = fastifyPlugin(database);

declare module "fastify" {
  export interface FastifyInstance {
    database: CommonQueryMethods;
  }
}

const customTimestampParser: { name: string; parse: (s: string) => string } = {
  name: "timestamp",
  parse: (s) => {
    return new Date(Date.parse(s + " UTC")).toISOString();
  },
};

const zodParserInterceptor = (): Interceptor => {
  return {
    name: "zod-result-parser-interceptor",
    // If you are not going to transform results using Zod, then you should use `afterQueryExecution` instead.
    // Future versions of Zod will provide a more efficient parser when parsing without transformations.
    // You can even combine the two – use `afterQueryExecution` to validate results, and (conditionally)
    // transform results as needed in `transformRow`.
    transformRowAsync: async (queryContext, query, result) => {
      const { resultParser } = queryContext;

      if (!resultParser) {
        return result;
      }

      // It is recommended (but not required) to parse async to avoid blocking the event loop during validation
      const validationResult = await (
        resultParser as z.ZodSchema
      ).safeParseAsync(result);

      if (!validationResult.success) {
        throw new SchemaValidationError(
          query,
          result,
          validationResult.error.issues,
        );
      }

      return validationResult.data as QueryResultRow;
    },
  };
};
