import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { UserSchema } from "../../types/schemas";
import { z } from "zod";
import { loginUserHandler } from "./handlers/loginUser";
import { signupUserHandler } from "./handlers/signupUser";
import { refreshTokenHandler } from "./handlers/refreshToken";
import { NotFoundError } from "../../errors/client";
import { logoutUserHandler } from "./handlers/logoutUser";

export const authRoutes: FastifyPluginAsync = async (instance) => {
  const app = instance.withTypeProvider<ZodTypeProvider>();
  const database = instance.database;

  app.post(
    "/signup",
    {
      schema: {
        summary: "Signs up a user",
        description: "Signs a user up, and inserts the details into the database",
        tags: ["actions"],
        body: UserSchema.pick({
          username: true,
          password: true,
          email: true,
          birthDate: true,
        }),
        response: {
          "200": UserSchema.omit({ password: true, salt: true }),
        },
      },
    },
    async (req, res) => {
      const user = await signupUserHandler({ database, user: req.body });
      return res.status(200).send(user);
    },
  );

  app.post(
    "/login",
    {
      schema: {
        summary: "Logins a user",
        descriptions: "Logins a user with the specified credentials. Returns an access and refresh token",
        tags: ["actions"],
        body: UserSchema.pick({ username: true, password: true }),
        response: {
          "401": z.object({
            code: z.string(),
            message: z.string(),
          }),
          "200": z.void(),
        },
      },
    },
    async (req, res) => {
      const { accessToken, refreshToken } = await loginUserHandler({ database, ...req.body });

      // Sets access and refresh token in the cookies
      res.setCookie("access_token", accessToken.token, {
        expires: new Date(accessToken.expiresAt),
      });
      res.setCookie("refresh_token", refreshToken.token, {
        expires: new Date(refreshToken.expiresAt),
      });

      return res.status(200).send();
    },
  );

  app.post(
    "/logout",
    {
      schema: {
        summary: "Logouts a user",
        descriptions: "Logouts a user. Deletes refresh token from database",
        tags: ["actions"],
        response: {
          "401": z.object({
            code: z.string(),
            message: z.string(),
          }),
          "200": z.void(),
        },
      },
    },
    async (req, res) => {
      const refreshToken = req.cookies["refresh_token"];
      if (!refreshToken) {
        throw new NotFoundError({
          code: "refresh-token-not-found-in-cookies",
          message: "The refresh token was not found in the request cookies",
        });
      }
      await logoutUserHandler({ database, refreshToken });

      // Clears access and refresh token cookies
      res.clearCookie("access_token");
      res.clearCookie("refresh_token");

      return res.status(200).send();
    },
  );

  app.post(
    "/token",
    {
      schema: {
        summary: "Refresh access token",
        descriptions: "Uses the refresh token to get a new access token",
        tags: ["actions"],
        body: z.object({
          refreshToken: z.string(),
        }),
        response: {
          "400": z.object({
            code: z.string(),
            message: z.string(),
          }),
          "200": z.void(),
        },
      },
    },
    async (req, res) => {
      // Get refresh token from body
      const refreshToken = req.body.refreshToken;
      const { token, expiresAt } = await refreshTokenHandler({ database, refreshToken });

      // Sets new access token in the cookies
      res.setCookie("access_token", token, {
        expires: new Date(expiresAt),
      });
      return res.status(200).send();
    },
  );
};
