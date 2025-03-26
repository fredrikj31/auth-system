import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { UserSchema } from "../../types/schemas";
import { UnauthorizedError } from "../../errors/client";
import { getUserById } from "../../services/database/queries/getUserById";
import { validateJwt } from "../../hooks/validateJwt";

export const usersRoutes: FastifyPluginAsync = async (instance) => {
  const app = instance.withTypeProvider<ZodTypeProvider>();
  const database = instance.database;

  app.get(
    "/me",
    {
      onRequest: [validateJwt],
      schema: {
        summary: "Get details about user",
        description: "Gets detailed information about the user requesting the route.",
        tags: ["users"],
        security: [
          {
            jwt: [""],
          },
        ],
        response: {
          "200": UserSchema.omit({ password: true, salt: true }),
        },
      },
    },
    async (req, res) => {
      const userId = req.user?.id;

      if (!userId) {
        throw new UnauthorizedError({
          code: "user-id-not-found-in-request",
          message: "A user id wasn't found in the request object",
        });
      }

      const user = await getUserById(database, { userId });
      return res.status(200).send(user);
    },
  );
};
