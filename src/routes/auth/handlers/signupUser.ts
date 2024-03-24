import { CommonQueryMethods } from "slonik";
import { createUser } from "../../../services/database/queries/createUser";
import { doesEmailExist } from "../../../services/database/queries/doesEmailExist";
import { User } from "../../../types/schemas";
import { ConflictError } from "../../../errors/client";
import { randomBytes, randomUUID } from "crypto";
import { generateHash } from "../../../helpers/generateHash";
import { config } from "../../../config";

interface SignupUserHandlerOptions {
  database: CommonQueryMethods;
  user: {
    username: string;
    password: string;
    email: string;
    birthDate: string;
  };
}

export const signupUserHandler = async ({ database, user }: SignupUserHandlerOptions): Promise<User> => {
  const isEmailTaken = await doesEmailExist(database, { email: user.email });

  if (isEmailTaken) {
    throw new ConflictError({
      code: "email-already-exists",
      message: "There is already a user signed up with that email",
    });
  }

  const userId = randomUUID();
  const userSalt = randomBytes(20).toString("hex");
  const hashedPassword = generateHash({
    password: user.password,
    userSalt,
    salt: config.passwordSalt,
  });

  const createdUser = await createUser(database, {
    userId,
    hashedPassword,
    passwordSalt: userSalt,
    username: user.username,
    email: user.email,
    birthDate: user.birthDate,
  });
  return createdUser;
};
