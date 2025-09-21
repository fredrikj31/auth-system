import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { UnauthorizedError } from "../../errors/client";
import { validateJwt } from "../../hooks/validateJwt";
import { ProfileSchema } from "../../types/profile";
import { getProfileById } from "../../services/database/queries/profile/getProfileById";

export const profilesRoutes: FastifyPluginAsync = async (instance) => {
  const app = instance.withTypeProvider<ZodTypeProvider>();
  const database = instance.database;

  app.get(
    "/me",
    {
      onRequest: [validateJwt],
      schema: {
        summary: "Get details about profile",
        description:
          "Gets detailed information about the profile requesting the route.",
        tags: ["profiles"],
        security: [
          {
            jwt: [""],
          },
        ],
        response: {
          "200": ProfileSchema.omit({
            createdAt: true,
            updatedAt: true,
            deletedAt: true,
          }),
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

      const user = await getProfileById(database, { userId });
      return res.status(200).send(user);
    },
  );
};
