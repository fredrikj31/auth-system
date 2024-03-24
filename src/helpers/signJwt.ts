import jwt from "jsonwebtoken";
import { config } from "../config";

interface SignJwtOptions {
  userId: string;
  username: string;
}

export const signJwt = ({ userId, username }: SignJwtOptions) => {
  return jwt.sign(
    {
      userId,
      username,
    },
    config.jwtPrivateKey,
    {
      expiresIn: "24h",
    },
  );
};
