import { CommonQueryMethods, sql } from "slonik";
import { logger } from "../../../../logging";
import { InternalServerError } from "../../../../errors/server";
import { Account, AccountSchema } from "../../../../types/account";
import { DateTime } from "luxon";

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
          password_salt,
          is_two_factor_authentication_enabled,
          two_factor_authentication_secret,
          two_factor_authentication_secret_salt,
          created_at,
          updated_at,
          deleted_at
        ) 
      VALUES
        (
          ${userId}, 
          ${email},
          ${hashedPassword},
          ${passwordSalt},
          ${false},
          ${null},
          ${null},
          ${DateTime.now().toUTC().toISO()},
          ${null},
          ${null}
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
