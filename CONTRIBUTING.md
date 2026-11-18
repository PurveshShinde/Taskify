# Contributing to Taskify

Thank you for your interest in contributing to Taskify. Taskify is an open-source task and workflow management platform built with React, Node.js, Express, TypeScript, and MongoDB.

Contributions from developers of all skill levels are welcomed. Please review the following guidelines before submitting issues or pull requests.

---

## Code of Conduct

All contributors and participants are expected to adhere to the project [Code of Conduct](./CODE_OF_CONDUCT.md). Please report any unacceptable behavior to the maintainer.

---

## How to Contribute

You can contribute to Taskify in several ways:
- Reporting bugs and reproducible issues.
- Suggesting new features or architectural improvements.
- Submitting pull requests to address open issues.
- Improving code coverage, documentation, or developer tooling.

---

## Reporting Issues

Before opening a new issue:
1. Check the [GitHub Issues](https://github.com/PurveshShinde/Taskify/issues) page to verify whether the bug or feature request has already been reported.
2. If the issue has not been reported, open a new issue using an informative title.

When filing a bug report, include:
- A clear, descriptive summary of the problem.
- Step-by-step instructions to reproduce the behavior.
- Expected behavior versus actual behavior.
- Relevant environment details:
  - Operating system and version.
  - Node.js and npm versions (`node -v`, `npm -v`).
  - Browser name and version (for frontend issues).
- Stack traces, console logs, or network payloads where applicable.

---

## Development Workflow

### 1. Fork and Clone

Fork the repository on GitHub, then clone your fork locally:

```bash
git clone https://github.com/<your-username>/Taskify.git
cd Taskify
```

Set the upstream repository:

```bash
git remote add upstream https://github.com/PurveshShinde/Taskify.git
git fetch upstream
```

### 2. Branching Strategy

Always create a new branch from `main` for your work. Use standard naming conventions:

- `feature/<short-description>`: New functionality or enhancements.
- `bugfix/<short-description>`: Bug and defect resolutions.
- `docs/<short-description>`: Documentation changes or additions.
- `refactor/<short-description>`: Code restructuring without functional changes.
- `chore/<short-description>`: Build, dependency, or configuration updates.

Example:

```bash
git checkout -b feature/team-analytics-export
```

### 3. Setup and Installation

Install all project dependencies across the root, client, and server workspaces:

```bash
npm run install:all
```

For complete local configuration, environment variables, and startup options, refer to [SETUP.md](./SETUP.md).

### 4. Running the Development Environment

Start both client and server concurrently:

```bash
npm run dev
```

Alternatively, run each tier in isolated terminal sessions:
- Server: `cd server && npm run dev` (defaults to http://localhost:5000)
- Client: `cd client && npm run dev` (defaults to http://localhost:5173)

---

## Coding Standards and Conventions

To maintain code quality and architectural consistency, adhere to the following standards:

### TypeScript & Types

- Write fully type-safe TypeScript code across both `client` and `server`.
- Avoid using `any`. Define interfaces or types for all domain models, request bodies, and API responses.
- Shared frontend data models belong in `client/src/types.ts`.
- Backend Mongoose document interfaces belong in their respective model definitions under `server/models/`.

### Frontend Guidelines

- Use React functional components with TypeScript and React Hooks.
- Style components using Tailwind CSS utility classes. Avoid inline style objects where possible.
- Use `lucide-react` for icons to maintain design consistency.
- Use `framer-motion` for UI transitions and micro-interactions.
- Keep components focused and modular under `client/src/components/` and page-level views under `client/src/pages/`.

### Backend Guidelines

- Structure backend logic following the controller-service pattern:
  - Routes (`server/routes/`): Define URL paths and link to controller methods.
  - Controllers (`server/controllers/`): Handle HTTP request validation, error responses, and status codes.
  - Services (`server/services/`): Handle standalone operations (e.g., email dispatch, background cron tasks).
  - Middleware (`server/middleware/`): Authentication, token verification, and request validation.
- Protect private endpoints using the `authMiddleware` JWT verification handler.
- Always return standardized JSON error envelopes: `{ message: string }`.

### Linting and Formatting

Run the client linter prior to committing changes:

```bash
cd client
npm run lint
```

Ensure no lint errors or unhandled warnings remain.

---

## Commit Message Guidelines

Taskify follows the Conventional Commits specification. Structure your commit messages as:

```text
<type>(<optional scope>): <description>

[optional body]

[optional footer(s)]
```

### Common Types:
- `feat`: A new feature or user-facing functionality.
- `fix`: A bug fix.
- `docs`: Documentation-only updates.
- `style`: Changes that do not affect code logic (formatting, whitespace).
- `refactor`: Code changes that neither fix a bug nor add a feature.
- `perf`: Performance improvements.
- `test`: Adding or correcting tests.
- `chore`: Tooling, build pipeline, or dependency updates.

### Examples:
- `feat(tasks): add priority filter to task list view`
- `fix(auth): handle expired Firebase ID token gracefully`
- `docs(setup): clarify MongoDB Atlas connection string setup`

---

## Pull Request Submission Process

1. Rebase your feature branch on the latest `upstream/main` to avoid merge conflicts:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```
2. Verify that both client and server build successfully:
   ```bash
   npm run build
   ```
3. Push your branch to your GitHub fork:
   ```bash
   git push origin <your-branch-name>
   ```
4. Open a Pull Request against the `main` branch of `PurveshShinde/Taskify`.
5. Fill out the PR description with:
   - Summary of changes introduced.
   - Related issue numbers (e.g., `Closes #12`).
   - Testing steps performed to verify the changes.
   - Screenshots or video recordings for frontend UI modifications.
6. Participate in code review and address any feedback promptly.

---

## License Attribution

By contributing to Taskify, you agree that your contributions will be licensed under the project's [MIT License](./LICENSE).

