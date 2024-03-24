import { CommonQueryMethods, sql } from "slonik";
import { UserSchema } from "../../../types/schemas";
import { logger } from "../../../logging";
import { InternalServerError } from "../../../errors/server";

interface DoesEmailExistOptions {
  email: string;
}

export const doesEmailExist = async (
  database: CommonQueryMethods,
  { email }: DoesEmailExistOptions,
): Promise<boolean> => {
  const user = await database
    .any(
      sql.type(UserSchema)`
      SELECT
        *
      FROM
        users
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

  if (user.length === 0) {
    return false;
  }
  return true;
};
