import {
  CommonQueryMethods,
  sql,
  NotFoundError as SlonikNotFoundError,
} from "slonik";
import { User, UserSchema } from "../../../types/schemas";
import { logger } from "../../../logging";
import { InternalServerError } from "../../../errors/server";
import { NotFoundError } from "../../../errors/client";

interface GetUserByIdOptions {
  userId: string;
}

export const getUserById = async (
  database: CommonQueryMethods,
  { userId }: GetUserByIdOptions,
): Promise<User> => {
  try {
    return await database.one(sql.type(UserSchema)`
      SELECT
        *
      FROM
        users
      WHERE
        id = ${userId};
    `);
  } catch (error) {
    if (error instanceof SlonikNotFoundError) {
      throw new NotFoundError({
        code: "user-not-found",
        message: "User with provided id, was not found in database",
      });
    }

    logger.error({ error }, "Error while getting user in database.");
    throw new InternalServerError({
      code: "unknown-error-getting-user-by-id",
      message: "Unknown error when trying to get user by id from database",
    });
  }
};
