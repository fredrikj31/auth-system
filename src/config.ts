import "dotenv/config";
import z from "zod";

const envVarsSchema = z.object({
  JWT_PRIVATE_KEY: z.string(),
  PASSWORD_SALT: z.string(),
  DB_HOST: z.string(),
  DB_PORT: z.string(),
  DB_NAME: z.string(),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
});

const envVars = envVarsSchema.safeParse(process.env);
if (!envVars.success) {
  // eslint-disable-next-line no-console
  console.error("There is an error with your environment variables.");
  throw envVars.error;
}

export const config = {
  jwtPrivateKey: envVars.data.JWT_PRIVATE_KEY,
  passwordSalt: envVars.data.PASSWORD_SALT,
  database: {
    host: envVars.data.DB_HOST,
    port: envVars.data.DB_PORT,
    name: envVars.data.DB_NAME,
    username: envVars.data.DB_USERNAME,
    password: envVars.data.DB_PASSWORD,
  },
};
