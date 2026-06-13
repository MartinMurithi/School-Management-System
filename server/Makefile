MIGRATE_IMAGE := migrate/migrate
NETWORK := school-system_school-system-net

DB_USER := postgres
DB_PASSWORD := martin321!
DB_PORT := 5438
DB_NAME := school_system
DB_HOST := school-system-db

MIGRATIONS_PATH := ${CURDIR}/database/migrations

DATABASE_URL := postgres://$(DB_USER):$(DB_PASSWORD)@$(DB_HOST):$(DB_PORT)/$(DB_NAME)?sslmode=disable

.PHONY: migrate-up migrate-down migrate-version migrate-force migrate-create

migrate-up:
	@read -p "Module (iam/school/etc): " module; \
	docker run --rm -it \
	--network $(NETWORK) \
	-v $(MIGRATIONS_PATH)/$$module:/migrations \
	$(MIGRATE_IMAGE) \
	-path=/migrations \
	-database "$(DATABASE_URL)" \
	up

migrate-down:
	@read -p "Module (iam/school/etc): " module; \
	docker run --rm -it \
	--network $(NETWORK) \
	-v $(MIGRATIONS_PATH)/$$module:/migrations \
	$(MIGRATE_IMAGE) \
	-path=/migrations \
	-database "$(DATABASE_URL)" \
	down 1

migrate-version:
	@read -p "Module (iam/school/etc): " module; \
	docker run --rm -it \
	--network $(NETWORK) \
	-v $(MIGRATIONS_PATH)/$$module:/migrations \
	$(MIGRATE_IMAGE) \
	-path=/migrations \
	-database "$(DATABASE_URL)" \
	version

migrate-force:
	@read -p "Module (iam/school/etc): " module; \
	read -p "Version to force: " version; \
	docker run --rm -it \
	--network $(NETWORK) \
	-v $(MIGRATIONS_PATH)/$$module:/migrations \
	$(MIGRATE_IMAGE) \
	-path=/migrations \
	-database "$(DATABASE_URL)" \
	force $$version

migrate-create:
	@read -p "Module (iam/school/etc): " module; \
	read -p "Migration name: " name; \
	docker run --rm -it \
	-v $(MIGRATIONS_PATH)/$$module:/migrations \
	$(MIGRATE_IMAGE) \
	create -ext sql -dir /migrations $$name

#====================================
#SQLC
#====================================

SQLC := sqlc

.PHONY: sqlc sqlc-iam

# IAM module
sqlc-iam:
	sqlc generate -f sqlc/iam.yml

# Generate ALL modules
sqlc: sqlc-iam sqlc-school sqlc-billing

#====================================
#DOCKER
#====================================

COMPOSE_FILE := docker-compose.yml

.PHONY: docker-up docker-down docker-build docker-logs docker-ps infra-up infra-down

infra-up:
	sudo fuser -k 5431/tcp 2>/dev/null; docker compose -f $(COMPOSE_FILE) down --remove-orphans && docker compose -f $(COMPOSE_FILE) up -d database

infra-down:
	docker compose -f $(COMPOSE_FILE) down

docker-up:
	docker compose -f $(COMPOSE_FILE) up -d

docker-down:
	docker compose -f $(COMPOSE_FILE) down

docker-build:
	docker compose -f $(COMPOSE_FILE) build

docker-logs:
	docker compose -f $(COMPOSE_FILE) logs -f

docker-ps:
	docker compose -f $(COMPOSE_FILE) ps

docker-restart:
	docker compose -f $(COMPOSE_FILE) restart

docker-rebuild:
	docker compose -f $(COMPOSE_FILE) up -d --build

.PHONY: run-api

run-api:
	go run ./cmd/api/main.go

#====================================
#LINT
#====================================

.PHONY: vet check

vet:
	go vet ./...

check: vet test

#====================================
#TESTS
#====================================

.PHONY: test test-verbose test-integration

test:
	go test ./internal/... -count=1

test-verbose:
	go test ./internal/... -v -count=1

test-integration:
	go test -tags=integration ./internal/... -v -count=1

.PHONY: build
build:
	go build -o bin/api ./cmd/api