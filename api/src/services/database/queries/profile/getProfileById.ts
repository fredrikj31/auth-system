import { CommonQueryMethods, sql } from "slonik";
import { logger } from "../../../../logging";
import { InternalServerError } from "../../../../errors/server";
import { Profile, ProfileSchema } from "../../../../types/profile";

interface GetProfileByIdOptions {
  userId: string;
}
export const getProfileById = async (
  database: CommonQueryMethods,
  { userId }: GetProfileByIdOptions,
): Promise<Profile> => {
  const profile = await database
    .one(
      sql.type(ProfileSchema)`
      SELECT
        *
      FROM
        profile
      WHERE
        user_id = ${userId};
    `,
    )
    .catch((error) => {
      logger.error({ error }, "Error while getting profile by user id");
      throw new InternalServerError({
        code: "failed-getting-profile-by-id",
        message: "Unknown error occurred when getting profile by user id",
      });
    });

  return profile;
};
