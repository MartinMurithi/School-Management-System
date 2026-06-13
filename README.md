# School System

School management system — Go API, PostgreSQL, React/Bun frontend.

---

## Requirements

### Go (≥1.25)

```bash
# Check version
go version

# Download: https://go.dev/dl/
#   or via package manager:
brew install go            # macOS
sudo apt install golang    # Ubuntu/Debian
sudo dnf install golang    # Fedora
```

### Bun (≥1.x)

```bash
# Check version
bun --version

# Install
curl -fsSL https://bun.sh/install | bash

# The project uses bun for the frontend
# After installing, cd into frontend/ and run:
bun install
```

### Docker + Compose (≥24 / compose v2.20+)

```bash
# Check versions
docker --version
docker compose version

# Install: https://docs.docker.com/engine/install/
#   Docker Desktop for macOS/Windows includes compose.
#   On Linux, install docker-ce + docker-compose-plugin.
```

**Why these versions?** The project uses `include:` in `docker-compose.yml` (requires Compose v2.20+).

---

## Server

### Without Docker

```bash
cd server
make infra-up        # start PostgreSQL in Docker
make run-api         # go run ./cmd/api/main.go  (port 3200)
```

The server auto-runs pending migrations on startup.

### With Docker

```bash
cd server
make docker-up       # build & start database + api
```

Stops with `make docker-down`.

---

## Frontend

### Without Docker

```bash
cd frontend
bun run dev          # dev server on port 8081
```

Requires the API to be running on port 3200.

### With Docker

```bash
cd frontend
make docker-up       # build & start frontend container
access it via http://localhost:8081/
```

Stops with `make docker-down`.

---

## Full stack (Docker)

From the project root:

```bash
make docker-up       # starts database, api, frontend
```

---

## URLs

| Service | URL |
|---|---|
| Frontend | http://localhost:8081 |
| API health | http://localhost:3200/**health** |
| Swagger UI | http://localhost:3200/swagger |
| Database | localhost:5431 |

---

## Tests

```bash
cd server && make test           # Go unit tests
cd server && make test-integration  # with a running DB
```

---

## Migrations (manual)

```bash
cd server
make migrate-create   # prompts for module + name
# files created in database/migrations/<module>/
```

---

## Git Workflow

### Branches

| Branch | Purpose |
|---|---|
| `main` | Production — deployed automatically |
| `develop` | Integration — PRs target this branch |
| `feature/*` | Daily work — branch off `develop` |

### Workflow

```text
feature/foo  ──→  develop  ──→  main
                      ↑              ↑
                 PR + CI       auto-deploy
                              on CI pass
```

### Step-by-step

**1. Start a new feature**

```bash
git checkout develop
git pull
git checkout -b feature/my-feature
```

**2. Work and commit**

```bash
git add .
git commit -m "feat: add my feature"
git push -u origin feature/my-feature
```

**3. Open a pull request**

- Go to the repo on GitHub
- Create a PR from `feature/my-feature` → `develop`
- CI runs automatically (vet, tests, type-check, lint)

**4. Merge to develop**

- Once CI passes, merge the PR to `develop`

**5. Auto-deploy to main**

- When code lands on `develop`, CI runs checks again
- If all checks pass, `develop` is **automatically pushed to `main`**

### Running checks locally before pushing

```bash
# Server
cd server
make check      # go vet + tests

# Frontend
cd frontend
bun run type-check
bun run lint
```
