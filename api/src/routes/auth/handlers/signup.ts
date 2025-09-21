import { CommonQueryMethods } from "slonik";
import { createAccount } from "../../../services/database/queries/account/createAccount";
import { doesEmailExist } from "../../../services/database/queries/account/doesEmailExist";
import { ConflictError } from "../../../errors/client";
import { randomBytes, randomUUID } from "crypto";
import { generateHash } from "../../../helpers/generateHash";
import { config } from "../../../config";
import { Account } from "../../../types/account";
import { Gender } from "../../../types/shared";
import { Profile } from "../../../types/profile";
import { createProfile } from "../../../services/database/queries/profile/createProfile";
import { doesUsernameExist } from "../../../services/database/queries/profile/doesUsernameExist";

interface SignupHandlerOptions {
  database: CommonQueryMethods;
  user: {
    email: string;
    password: string;
    username: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: Gender;
  };
}

export const signupHandler = async ({
  database,
  user,
}: SignupHandlerOptions): Promise<
  Pick<Account, "userId" | "email"> &
    Omit<Profile, "userId" | "createdAt" | "updatedAt" | "deletedAt">
> => {
  const isEmailTaken = await doesEmailExist(database, { email: user.email });
  if (isEmailTaken) {
    throw new ConflictError({
      code: "email-already-exists",
      message: "There is already a user signed up with that email",
    });
  }

  const isUsernameTaken = await doesUsernameExist(database, {
    username: user.username,
  });
  if (isUsernameTaken) {
    throw new ConflictError({
      code: "username-already-exists",
      message: "There is already a user signed up with that username",
    });
  }

  const userId = randomUUID();
  const userSalt = randomBytes(20).toString("hex");
  const hashedPassword = generateHash({
    password: user.password,
    userSalt,
    salt: config.tokens.passwordSalt,
  });

  const { email } = await createAccount(database, {
    userId,
    email: user.email,
    hashedPassword,
    passwordSalt: userSalt,
  });

  const { username, firstName, lastName, birthDate, gender } =
    await createProfile(database, {
      userId,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      birthDate: user.birthDate,
      gender: user.gender,
    });

  return {
    userId,
    email,
    username,
    firstName,
    lastName,
    birthDate,
    gender,
  };
};
