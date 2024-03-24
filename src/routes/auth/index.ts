import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { UserSchema } from "../../types/schemas";
import { z } from "zod";
import { loginUserHandler } from "./handlers/loginUser";
import { signupUserHandler } from "./handlers/signupUser";

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
          "200": z.object({
            accessToken: z.string(),
          }),
        },
      },
    },
    async (req, res) => {
      const result = await loginUserHandler({ database, ...req.body });

      if (!result) {
        return res.status(401).send({
          code: "Unauthorized",
          message: "The credentials provided was incorrect.",
        });
      }

      return res.status(200).send({ accessToken: result });
    },
  );
};
