# CSM Monorepo

A full-stack monorepo featuring a Django REST Framework API server and a React + Vite + TypeScript client. Containerized development is powered by Docker and docker-compose with a Postgres database.

## Repository structure

```
.
├── client/   # React + Vite + TypeScript frontend
├── server/   # Django + Django REST Framework backend
├── docker-compose.yml
└── .env.example
```

## Prerequisites

- [Docker](https://www.docker.com/get-started/) and [docker-compose](https://docs.docker.com/compose/) (v2+) for containerized workflows.
- Optional: Python 3.11+, Node.js 18+ if running services locally without Docker.

## Getting started

1. Copy the example environment file and customize as needed:

   ```bash
   cp .env.example .env
   ```

2. Start the full stack with docker-compose:

   ```bash
   docker-compose up --build
   ```

   - API available at http://localhost:8000
   - Frontend available at http://localhost:5173
   - Healthcheck endpoint: http://localhost:8000/health/

3. Apply Django migrations (in another terminal):

   ```bash
   docker-compose exec server python manage.py migrate
   ```

## Development workflows

### Backend (Django + DRF)

- Install dependencies:

  ```bash
  pip install -r server/requirements.txt
  ```

- Run the development server:

  ```bash
  cd server
  export DJANGO_DEBUG=true
  python manage.py runserver
  ```

- Code style: [Black](https://black.readthedocs.io/en/stable/) and [isort](https://pycqa.github.io/isort/) configured via `server/pyproject.toml`.

  ```bash
  black .
  isort .
  ```

### Frontend (React + Vite + TypeScript)

- Install dependencies:

  ```bash
  cd client
  npm install
  ```

- Run the development server:

  ```bash
  npm run dev
  ```

- Code style: [Prettier](https://prettier.io/) and [ESLint](https://eslint.org/).

  ```bash
  npm run format
  npm run lint
  ```

## Environment variables

Update `.env` (based on `.env.example`) to configure the stack. Key variables include:

- `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`: Postgres configuration shared by the server and database container.
- `DJANGO_SECRET_KEY`, `DJANGO_DEBUG`, `DJANGO_ALLOWED_HOSTS`: Django runtime settings.
- `VITE_API_BASE_URL`: Frontend API base path, proxied to the Django service in development.

## Testing

- Backend: `pytest`/`unittest` can be added as needed. Django's `manage.py test` is available out of the box.
- Frontend: Add tests via Vite + Vitest or React Testing Library as the project evolves.

## Deployment notes

- The production-ready server container runs `gunicorn` (`server/Dockerfile`).
- The frontend container builds the static assets and serves them via `vite preview` (`client/Dockerfile`).
- Customize Dockerfiles or compose overrides to match your deployment target.
