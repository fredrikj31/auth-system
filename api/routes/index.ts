import { FastifyPluginAsync } from "fastify";
import {
  validatorCompiler,
  serializerCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { z } from "zod";

export const routes: FastifyPluginAsync = async (instance) => {
  instance.setValidatorCompiler(validatorCompiler);
  instance.setSerializerCompiler(serializerCompiler);

  const app = instance.withTypeProvider<ZodTypeProvider>();
  app.get(
    "/ping",
    {
      schema: {
        response: {
          "200": z.object({ ok: z.boolean() }),
        },
      },
    },
    async (req, res) => {
      return res.send({ ok: true });
    }
  );
};
