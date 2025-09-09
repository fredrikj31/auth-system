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
} from "slonik";
import { createFieldNameTransformationInterceptor } from "slonik-interceptor-field-name-transformation";
import { logger } from "../../logging";

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
            format: "CAMEL_CASE",
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
    transformRow: (executionContext, actualQuery, row) => {
      const { resultParser } = executionContext;

      if (!resultParser) {
        return row;
      }

      const validationResult = resultParser.safeParse(row);

      if (!validationResult.success) {
        throw new Error("The database returned some invalid data.");
      }

      return validationResult.data as QueryResultRow;
    },
  };
};
