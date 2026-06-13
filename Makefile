.PHONY: dev dev-api dev-frontend docker-up docker-down infra-up infra-down

dev-api:
	make -C server run-api

dev-frontend:
	make -C frontend dev

dev:
	make -C server run-api & make -C frontend dev

docker-up:
	sudo fuser -k 3200/tcp 5431/tcp 8081/tcp 2>/dev/null; docker compose down --remove-orphans && docker compose up -d --build

docker-down:
	docker compose down

infra-up:
	make -C server infra-up

infra-down:
	make -C server infra-down
