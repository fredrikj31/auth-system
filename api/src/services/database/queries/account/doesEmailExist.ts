import { CommonQueryMethods, sql } from "slonik";
import { AccountSchema } from "../../../../types/account";
import { logger } from "../../../../logging";
import { InternalServerError } from "../../../../errors/server";

interface DoesEmailExistOptions {
  email: string;
}

export const doesEmailExist = async (
  database: CommonQueryMethods,
  { email }: DoesEmailExistOptions,
): Promise<boolean> => {
  const account = await database
    .any(
      sql.type(AccountSchema)`
      SELECT
        *
      FROM
        account
      WHERE
        email = ${email};
    `,
    )
    .catch((error) => {
      logger.error({ error }, "Error while checking if email exists");
      throw new InternalServerError({
        code: "failed-checking-email-exists",
        message: "Unknown error occurred when checking if email exists",
      });
    });

  if (account.length === 0) {
    return false;
  }
  return true;
};
