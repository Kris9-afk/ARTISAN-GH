## Y3FIX-GH frontend and backend

The React application is in `frontend/`; the Node API is in `backend/`. In production,
host the frontend and API as web services and use Neon for PostgreSQL. Neon is the
database host; it does not run the Node API.

### Deploy the API to Render

The root `render.yaml` defines the API web service. In Render, create a Blueprint from
this repository and provide these secret environment variables for the API service:

- `DATABASE_URL`: the pooled Neon connection string, including `sslmode=require`
- `ADMIN_ACCESS_CODE`: a long, private admin code

Do not commit either value or expose them as `VITE_` variables. On startup, the API
creates its PostgreSQL tables and seeds artisans, services, reviews, and testimonials
from the frontend catalog. It also imports legacy artisans from `backend/data.json`
when the artisans table is empty. Render checks `/api/health` to confirm the service
is healthy.

After Render creates the API service, set `VITE_API_URL` in the frontend host's build
environment to the public API URL ending in `/api` (for example,
`https://artisan-gh-api.onrender.com/api`) and redeploy the frontend. The frontend
host must be `https://artisan-gh.onrender.com` or the API's `FRONTEND_ORIGIN` value
must be changed to match the actual frontend origin.

### Local development (optional)

The local Vite server runs on port 5173 and proxies `/api` requests to a local API on
port 4000. To use Neon from local development, create `backend/.env` (ignored by Git):

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require
ADMIN_ACCESS_CODE=choose-a-long-private-code
```

Run `npm run dev:full` to start both local processes, or `npm run backend` and
`npm run dev` separately. Local development is not required for the deployed
application; the hosted frontend calls the Render API through `VITE_API_URL`.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
