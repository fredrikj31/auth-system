import { CommonQueryMethods, sql } from "slonik";
import { logger } from "../../../../logging";
import { InternalServerError } from "../../../../errors/server";
import { Account, AccountSchema } from "./schemas";

interface CreateAccountOptions {
  userId: string;
  email: string;
  hashedPassword: string;
  passwordSalt: string;
}

export const createAccount = async (
  database: CommonQueryMethods,
  { userId, email, hashedPassword, passwordSalt }: CreateAccountOptions,
): Promise<Account> => {
  try {
    return await database.one(sql.type(AccountSchema)`
      INSERT INTO 
        account (
          user_id, 
          email, 
          password,
          salt
        ) 
      VALUES
        (
          ${userId}, 
          ${email},
          ${hashedPassword},
          ${passwordSalt}
        )
      RETURNING *;
    `);
  } catch (error) {
    logger.error({ error }, "Error while creating account in database.");
    throw new InternalServerError({
      code: "unknown-error-creating-new-account",
      message: "Unknown error when trying to create account",
    });
  }
};
