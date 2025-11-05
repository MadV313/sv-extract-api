# SV Extract — API

Node/Express + Postgres. Health, guest auth, cloud save, and simple leaderboard. Ready for Railway.

## Run Local

1) `cp .env.example .env` and set `DATABASE_URL`
2) `npm i`
3) Initialize DB schema:
   - Ensure `psql` is installed and available in PATH
   - Run `npm run db:init`
4) Start dev: `npm run dev`
5) Check: `GET http://localhost:8080/health`

## Endpoints

- `GET  /health`
- `POST /v1/auth/guest` → returns `{ id, name }`
- `GET  /v1/profile/:id`
- `POST /v1/save/:id`  → body `{ "slot": 0, "data": { ... } }`
- `GET  /v1/save/:id`
- `GET  /v1/leaderboard/top`

## Railway Quick Checklist

1. Create Railway project → Deploy from GitHub repo `sv-extract-api`
2. Add **PostgreSQL** plugin (Railway injects `DATABASE_URL`)
3. Add variables:  
   - `PGSSL=true`  
   - `CORS_ORIGINS=https://localhost,http://localhost:3000,http://localhost:5173`
4. Deploy → open `/health`
5. Open **Shell** → run `npm run db:init` once

## Unity Quick Notes

- In your Unity client, set `ApiBase` to the deployed Railway URL.
- Example call to create a guest:
  ```csharp
  async void TestApi()
  {
      var guest = await ApiClient.PostJson("/v1/auth/guest", "{}");
      Debug.Log(guest);
  }
