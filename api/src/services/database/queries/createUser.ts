import { CommonQueryMethods, sql } from "slonik";
import { User, UserSchema } from "../../../types/schemas";
import { logger } from "../../../logging";
import { InternalServerError } from "../../../errors/server";

interface CreateUserOptions {
  userId: string;
  username: string;
  hashedPassword: string;
  passwordSalt: string;
  email: string;
  birthDate: string;
}

export const createUser = async (
  database: CommonQueryMethods,
  {
    userId,
    username,
    hashedPassword,
    passwordSalt,
    email,
    birthDate,
  }: CreateUserOptions,
): Promise<User> => {
  try {
    return await database.one(sql.type(UserSchema)`
      INSERT INTO 
        users (
          id, 
          username, 
          password, 
          salt, 
          email, 
          birth_date
        ) 
      VALUES
        (
          ${userId}, 
          ${username},
          ${hashedPassword},
          ${passwordSalt},
          ${email},
          ${birthDate}
        )
      RETURNING *;
    `);
  } catch (error) {
    logger.error({ error }, "Error while creating user in database.");
    throw new InternalServerError({
      code: "unknown-error-creating-new-user",
      message: "Unknown error when trying to create user",
    });
  }
};
