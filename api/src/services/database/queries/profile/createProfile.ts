import { CommonQueryMethods, sql } from "slonik";
import { logger } from "../../../../logging";
import { InternalServerError } from "../../../../errors/server";
import { Gender } from "../../../../types/shared";
import { DateTime } from "luxon";
import { Profile, ProfileSchema } from "../../../../types/profile";

interface CreateProfileOptions {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: Gender;
}

export const createProfile = async (
  database: CommonQueryMethods,
  {
    userId,
    username,
    firstName,
    lastName,
    birthDate,
    gender,
  }: CreateProfileOptions,
): Promise<Profile> => {
  try {
    return await database.one(sql.type(ProfileSchema)`
      INSERT INTO 
        profile (
          user_id, 
          username, 
          first_name, 
          last_name, 
          birth_date, 
          gender, 
          created_at, 
          updated_at, 
          deleted_at 
        ) 
      VALUES
        (
          ${userId}, 
          ${username},
          ${firstName},
          ${lastName},
          ${birthDate},
          ${gender},
          ${DateTime.now().toUTC().toISO()},
          ${null},
          ${null}
        )
      RETURNING *;
    `);
  } catch (error) {
    logger.error({ error }, "Error while creating profile in database.");
    throw new InternalServerError({
      code: "unknown-error-creating-new-profile",
      message: "Unknown error when trying to create profile",
    });
  }
};
