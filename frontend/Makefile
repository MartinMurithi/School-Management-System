.PHONY: dev dev-frontend build lint preview docker-up docker-down

dev dev-frontend:
	bun run dev

build:
	bun run build

lint:
	bun run lint

preview:
	bun run preview

docker-up:
	docker compose -f docker-compose.yml up -d

docker-down:
	docker compose -f docker-compose.yml down
