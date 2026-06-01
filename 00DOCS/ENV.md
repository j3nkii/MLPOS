# Environment variables

## Local (`backend/.env` or shell)

| Variable | Purpose |
|----------|---------|
| `NODE_ENV` | `develop` (email-as-token auth) or `production` (Cognito) |
| `DB_NAME` | Postgres database name |
| `DB_HOST` | `localhost` locally |
| `DB_PORT` | `5432` |
| `DB_USER` | Postgres user (local optional) |
| `DB_PASSWORD` | Postgres password (local optional) |
| `COGNITO_CLIENT_ID` | App client id (prod login) |
| `STRIPE_SECRET_KEY` | Stripe platform secret |
| `AWS_REGION` | e.g. `us-east-2` |

## Lambda (Terraform `infra/main.tf`)

Set today: `NODE_ENV`, `DB_*`, `COGNITO_CLIENT_ID`.

**Gap:** `STRIPE_SECRET_KEY` not in Terraform yet (B4.1).

## Develop auth

`NODE_ENV=develop` — Bearer token is the user's **email** (see seeds: `j3nkii`).
