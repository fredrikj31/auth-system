export default {
  "app/**/*": () => ["pnpm run app:format:check", "pnpm run app:lint", "pnpm run app:build:check"],
  "api/**/*": () => ["pnpm run api:format:check", "pnpm run api:lint", "pnpm run api:build:check"],
};
