# include .env # simpler to just let user or godotenv handle env, or rely on manual vars. 
# But to read DATABASE_URL for the docker command from .env, we can use a hack or just assume it is set.
# On Windows Make, just including might work if valid makefile syntax.
include .env

.PHONY: run test migrate-up migrate-down sqlc

run:
	go run cmd/api/main.go

test:
	go test ./... -v

# Use host.docker.internal for Windows Docker connectivity to host localhost
# Using CURDIR which is standard make variable (PWD is shell env)
MIGRATION_DB_URL=$(subst localhost,host.docker.internal,$(DATABASE_URL))

migrate-up:
	docker run --rm -v "$(CURDIR)/db/migrations:/migrations" migrate/migrate -path=/migrations -database "$(MIGRATION_DB_URL)" up

migrate-down:
	docker run --rm -v "$(CURDIR)/db/migrations:/migrations" migrate/migrate -path=/migrations -database "$(MIGRATION_DB_URL)" down 1

sqlc:
	sqlc generate
