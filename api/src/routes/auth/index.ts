import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { AccountSchema } from "../../types/account";
import { ProfileSchema } from "../../types/profile";
import { z } from "zod";
import { loginHandler } from "./handlers/login";
import { signupHandler } from "./handlers/signup";
import { refreshTokenHandler } from "./handlers/refreshToken";
import { NotFoundError } from "../../errors/client";
import { logoutHandler } from "./handlers/logout";
import { DateTime } from "luxon";

export const authRoutes: FastifyPluginAsync = async (instance) => {
  const app = instance.withTypeProvider<ZodTypeProvider>();
  const database = instance.database;

  app.post(
    "/signup",
    {
      schema: {
        summary: "Signs up a user",
        description:
          "Signs a user up, and inserts the details into the database.",
        tags: ["actions"],
        body: z.object({
          ...AccountSchema.omit({
            userId: true,
            passwordSalt: true,
            createdAt: true,
            updatedAt: true,
            deletedAt: true,
          }).shape,
          ...ProfileSchema.omit({
            userId: true,
            createdAt: true,
            updatedAt: true,
            deletedAt: true,
          }).shape,
        }),
        response: {
          "200": z.object({
            ...AccountSchema.omit({
              password: true,
              passwordSalt: true,
              createdAt: true,
              updatedAt: true,
              deletedAt: true,
            }).shape,
            ...ProfileSchema.omit({
              userId: true,
              createdAt: true,
              updatedAt: true,
              deletedAt: true,
            }).shape,
          }),
        },
      },
    },
    async (req, res) => {
      const user = await signupHandler({ database, user: req.body });
      return res.status(200).send(user);
    },
  );

  app.post(
    "/login",
    {
      schema: {
        summary: "Logins a user",
        descriptions:
          "Logins a user with the specified credentials. Returns an access and refresh token.",
        tags: ["actions"],
        body: AccountSchema.pick({ email: true, password: true }),
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
      const { accessToken, refreshToken } = await loginHandler({
        database,
        ...req.body,
      });

      // Sets access and refresh token in the cookies
      res.setCookie("access_token", accessToken.token, {
        expires: DateTime.fromISO(accessToken.expiresAt).toUTC().toJSDate(),
      });
      res.setCookie("refresh_token", refreshToken.token, {
        expires: DateTime.fromISO(refreshToken.expiresAt).toUTC().toJSDate(),
      });

      return res.status(200).send();
    },
  );

  app.post(
    "/logout",
    {
      schema: {
        summary: "Logouts a user",
        descriptions: "Logouts a user. Deletes refresh token from database.",
        tags: ["actions"],
        body: z.object({
          refreshToken: z.string(),
        }),
        response: {
          "401": z.object({
            code: z.string(),
            message: z.string(),
          }),
          "200": z.object({
            ok: z.boolean(),
          }),
        },
      },
    },
    async (req, res) => {
      const refreshToken = req.body.refreshToken;
      if (!refreshToken) {
        throw new NotFoundError({
          code: "refresh-token-not-found-in-body",
          message: "The refresh token was not found in the request body.",
        });
      }
      await logoutHandler({ database, refreshToken });

      // Clears access and refresh token cookies
      res.clearCookie("access_token");
      res.clearCookie("refresh_token");

      return res.status(200).send({
        ok: true,
      });
    },
  );

  app.post(
    "/token",
    {
      schema: {
        summary: "Refresh access token",
        descriptions: "Uses the refresh token to get a new access token.",
        tags: ["actions"],
        body: z.object({
          refreshToken: z.string(),
        }),
        response: {
          "400": z.object({
            code: z.string(),
            message: z.string(),
          }),
          "200": z.object({
            ok: z.boolean(),
          }),
        },
      },
    },
    async (req, res) => {
      // Get refresh token from body
      const refreshToken = req.body.refreshToken;
      const { token, expiresAt } = await refreshTokenHandler({
        database,
        refreshToken,
      });

      // Sets new access token in the cookies
      res.setCookie("access_token", token, {
        expires: DateTime.fromISO(expiresAt).toUTC().toJSDate(),
      });
      return res.status(200).send({
        ok: true,
      });
    },
  );
};
