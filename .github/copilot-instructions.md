<!-- Brief, repo-specific instructions for AI coding agents -->
# Copilot instructions (repo-specific)

This Node.js API uses ES modules + Express + Mongoose. Use these notes to make code changes that are consistent with this codebase.

- **Project entry points:** `server.js` starts the HTTP server and imports `app.js`. Application wiring is in `app.js`.
- **DB:** `config/db.js` calls `mongoose.connect(process.env.MONGO_URI)`. Ensure `MONGO_URI` is present in the environment when running locally.
- **Auth:** JWT auth issues tokens in `controllers/authController.js` (payload: `{ id, role }`). Middleware `middleware/authMiddleware.js` expects `Authorization: Bearer <token>` and sets `req.user` to the decoded token (not the full user document).

- **Routing pattern:** Routes live under `routes/` and map 1:1 to controller exports in `controllers/`. Example: `routes/roomRoutes.js` imports named handlers from `controllers/roomController.js` and applies `protect` and `adminOnly` middleware where needed.

- **Models:** Mongoose models are in `models/`.
  - `models/User.js`: `email` is unique; `role` enum: `admin | user`.
  - `models/Room.js`: `roomNumber` is unique; `status` enum: `available | occupied | maintenance`.
  - `models/Booking.js`: references `User` and `Room`; `status` enum: `pending | approved | rejected`.

- **Error handling:** `app.js` registers a generic error handler that logs `err.stack` and returns HTTP 500 with a JSON message. Controllers typically use `try/catch` and return status codes and `{ message }` payloads.

- **Environment vars used:** `MONGO_URI`, `JWT_SECRET`, optional `PORT`. Keep values secure; `JWT_SECRET` is required for token operations.

- **Conventions & patterns to follow:**
  - Use ES module imports/exports (no CommonJS). Files use `export const handler = ...` or `export default` for models.
  - Controllers return JSON with a `message` field; include relevant data under a clear key (e.g., `token`, `user`, or model object).
  - Authorization middleware sets `req.user` to the decoded token (contains `id` and `role`). If you need the full user document, explicitly load it in the controller.
  - Role checks are implemented via `adminOnly` middleware — prefer adding the middleware at the route level (not inside controllers) to keep handlers focused.

- **Run / dev commands:** `package.json` does not define start scripts. To run locally use:

```bash
npx nodemon server.js   # development (nodemon is a devDependency)
node server.js         # run directly
```

- **Examples:**
  - Login request: POST `/api/auth/login` with JSON `{ "email": "...", "password": "..."` }. Response contains `token`.
  - Authenticated request: set header `Authorization: Bearer <token>`; routes that require admin also use `adminOnly`.

- **When changing data models or APIs:**
  - Update the corresponding model in `models/` and all controllers that create/read that model.
  - Update routes in `routes/` to keep route signatures consistent.

If something is unclear or you need more examples (sample requests, tests, or suggested npm scripts), say which area you'd like expanded and I'll iterate.
