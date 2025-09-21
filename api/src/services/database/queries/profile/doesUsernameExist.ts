import { CommonQueryMethods, sql } from "slonik";
import { ProfileSchema } from "../../../../types/profile";
import { logger } from "../../../../logging";
import { InternalServerError } from "../../../../errors/server";

interface DoesUsernameExistOptions {
  username: string;
}

export const doesUsernameExist = async (
  database: CommonQueryMethods,
  { username }: DoesUsernameExistOptions,
): Promise<boolean> => {
  const user = await database
    .any(
      sql.type(ProfileSchema)`
      SELECT
        *
      FROM
        profile
      WHERE
        username = ${username};
    `,
    )
    .catch((error) => {
      logger.error({ error }, "Error while checking if username exists");
      throw new InternalServerError({
        code: "failed-checking-username-exists",
        message: "Unknown error occurred when checking if username exists",
      });
    });

  if (user.length === 0) {
    return false;
  }
  return true;
};
