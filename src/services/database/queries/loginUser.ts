import { CommonQueryMethods, NotFoundError as SlonikNotFoundError, sql } from "slonik";
import { generateHash } from "../../../helpers/generateHash";
import { User, UserSchema } from "../../../types/schemas";
import { config } from "../../../config";
import { logger } from "../../../logging";
import { InternalServerError } from "../../../errors/server";
import { BadRequestError, NotFoundError } from "../../../errors/client";

interface LoginUserOptions {
  username: string;
  password: string;
}

export const loginUser = async (
  database: CommonQueryMethods,
  { username, password }: LoginUserOptions,
): Promise<User> => {
  const user = await database
    .one(
      sql.type(UserSchema)`
      SELECT
        *
      FROM
        users
      WHERE
        username = ${username};
    `,
    )
    .catch((error) => {
      if (error instanceof SlonikNotFoundError) {
        logger.info({ username }, "No user found with that username");
        throw new NotFoundError({
          code: "user-not-found",
          message: "No user with the provided username was found",
        });
      }

      logger.error({ username, error }, "Error while logging user in");
      throw new InternalServerError({
        code: "error-getting-user-with-credentials",
        message: "Unknown error occurred when trying to get user with provided credentials",
      });
    });

  const hashedPassword = generateHash({
    password,
    userSalt: user.salt,
    salt: config.passwordSalt,
  });

  if (hashedPassword !== user.password) {
    logger.info({ username }, "The provided password didn't match hashed password in database");
    throw new BadRequestError({
      code: "incorrect-password",
      message: "The provided password was incorrect",
    });
  }

  return user;
};
