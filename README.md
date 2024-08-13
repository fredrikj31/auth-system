# auth-system

A simple authentication/authorization system, which uses JWTs

### Environment Variables

```bash
# App
VITE_API_BASE_URL=http://localhost:3000

# API
WEBSITE_BASE_URL=http://localhost:5173

# Tokens
JWT_PRIVATE_KEY=...
PASSWORD_SALT=...
COOKIE_SECRET=...

# Database (running in Docker)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=auth-system
DB_USERNAME=postgres
DB_PASSWORD=password
```
