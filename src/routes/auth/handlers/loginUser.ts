import { CommonQueryMethods } from "slonik";
import { loginUser } from "../../../services/database/queries/loginUser";
import { signJwt } from "../../../helpers/signJwt";

interface LoginUserHandlerOptions {
  database: CommonQueryMethods;
  username: string;
  password: string;
}

export const loginUserHandler = async ({
  database,
  username,
  password,
}: LoginUserHandlerOptions): Promise<string | null> => {
  const user = await loginUser(database, {
    username,
    password,
  });

  const jwt = signJwt({
    userId: user.id,
    username: user.username,
  });

  return jwt;
};
