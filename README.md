# Vidyora

Learning app + API for Classes 6–10 (English medium).

- **Mobile app** — Expo / React Native (`src/`): class picker, subjects, chapters, lessons and progress.
- **API server** — NestJS + Fastify + Swagger (`server/`), backed by PostgreSQL (TypeORM).

## Quick start

```bash
npm install     # app dependencies
npm run dev     # starts PostgreSQL + pgAdmin (Docker), the API and the Expo app
```

| Service                    | URL                                              |
| -------------------------- | ------------------------------------------------ |
| Swagger UI                 | http://localhost:3000/docs                      |
| Swagger UI from your LAN   | http://`<your-lan-ip>`:3000/docs                  |
| pgAdmin                    | http://localhost:5050                            |
| Expo app                   | follow the QR code / terminal instructions        |

`npm run api` runs only the backend (Postgres + pgAdmin + API) if you don't need the mobile app.

## API server (NestJS + Fastify + Swagger)

The server exposes the app's curriculum (classes, subjects, chapters and lesson content) and stores student progress in PostgreSQL. The database is created and seeded with the full Class 6–10 curriculum on first start — no setup steps.

The API listens on `0.0.0.0`, so everyone on the same network can open the Swagger UI at the URL printed at startup (also available locally at http://localhost:3000/docs).

### Endpoints

| Method | Path                                                     | Description                                            |
| ------ | -------------------------------------------------------- | ------------------------------------------------------ |
| GET    | `/api/v1/health`                                         | Health check                                           |
| GET    | `/api/v1/classes`                                        | List all classes (Class 6 – Class 10)                  |
| GET    | `/api/v1/classes/:classId`                               | Get a single class                                     |
| GET    | `/api/v1/classes/:classId/subjects`                      | Subjects of a class, each with its chapter count       |
| GET    | `/api/v1/classes/:classId/subjects/:subjectId/chapters`  | Chapters of a subject in a class                       |
| GET    | `/api/v1/chapters/:chapterId`                             | Full chapter content (overview, points, questions)      |
| GET    | `/api/v1/progress/:studentId?classId=class-6`            | Progress of a student, optionally scoped to one class  |
| PUT    | `/api/v1/progress/:studentId/chapters/:chapterId`         | Mark a chapter completed (or clear it)                 |

All endpoints are documented and testable in the Swagger UI.

### PostgreSQL + pgAdmin

Postgres and pgAdmin run as Docker containers (`docker-compose.yml`):

- **pgAdmin**: http://localhost:5050 — user `admin@example.com`, password `admin`
- A server named **Vidyora Postgres** is pre-configured; enter password `vidyora` when prompted (tick *Save password*)
- Postgres is exposed on host port **5433** (user / password / database: `vidyora`)

### Configuration (optional)

The API reads these environment variables. The defaults match the bundled Docker setup:

| Variable       | Default     | Description                        |
| -------------- | ----------- | ---------------------------------- |
| `PORT`         | `3000`      | API port                           |
| `HOST`         | `0.0.0.0`   | Listen address                     |
| `DB_HOST`      | `localhost` | Postgres host                      |
| `DB_PORT`      | `5433`      | Postgres port                      |
| `DB_USER`      | `vidyora`   | Postgres user                      |
| `DB_PASSWORD`  | `vidyora`   | Postgres password                  |
| `DB_NAME`      | `vidyora`   | Postgres database                  |

### Database management

```bash
npm run db:down    # stop the containers (data is kept)
npm run db:reset   # stop the containers and delete the data (re-seeds on next start)
```

---

## Mobile app (Expo)

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

### Get started

1. Install dependencies (also done by `npm run dev`)

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in the

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out Expo apps

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, take a look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides/)
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you will build an application that runs on Android, iOS, and the web

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and universal application project.
- [Discord community](https://chat.expo.dev/): Chat with other developers about building with Expo and Router.
