.PHONY: setup dev build test clean docker-up docker-down

setup:
	pnpm install
	pnpm db:generate
	pnpm db:migrate
	pnpm db:seed

dev:
	make docker-up
	pnpm dev

build:
	pnpm build

test:
	pnpm test

lint:
	pnpm lint

clean:
	pnpm clean
	docker-compose down -v

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

reset-db:
	docker-compose down postgres
	docker volume rm travoy-erp_postgres_data
	docker-compose up -d postgres
	sleep 5
	pnpm db:migrate
	pnpm db:seed