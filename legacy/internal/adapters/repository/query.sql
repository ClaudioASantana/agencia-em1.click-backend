-- name: CreateUser :one
INSERT INTO users (name, email, password_hash, active)
VALUES ($1, $2, $3, $4)
RETURNING id, name, email, password_hash, active, created_at, updated_at;

-- name: CountUsers :one
SELECT count(*) FROM users;;

-- name: ListUsers :many
SELECT id, name, email, password_hash, active, created_at, updated_at
FROM users
ORDER BY id
LIMIT $1 OFFSET $2;

-- name: UpdateUser :one
UPDATE users
SET name = $2, email = $3, active = $4, updated_at = NOW()
WHERE id = $1
RETURNING id, name, email, password_hash, active, created_at, updated_at;

-- name: DeleteUser :exec
DELETE FROM users
WHERE id = $1;

-- name: GetUser :one
SELECT id, name, email, password_hash, active, created_at, updated_at
FROM users
WHERE id = $1;

-- name: GetUserByEmail :one
SELECT id, name, email, password_hash, active, created_at, updated_at
FROM users
WHERE email = $1;
