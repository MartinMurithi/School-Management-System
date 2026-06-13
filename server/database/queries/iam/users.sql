-- name: CreateIAMUser :one
INSERT INTO iam_users (
        id,
        email,
        phone,
        status,
        created_at,
        updated_at
    )
VALUES ($1, $2, $3, $4, now(), now())
RETURNING *;

-- name: GetIAMUserByID :one
SELECT *
FROM iam_users
WHERE id = $1;

-- name: GetIAMUserByEmail :one
SELECT *
FROM iam_users
WHERE email = $1;

-- name: ListIAMUsers :many
SELECT *
FROM iam_users
ORDER BY created_at DESC;

-- name: UpdateIAMUser :one
UPDATE iam_users
SET email = $2,
    phone = $3,
    updated_at = now()
WHERE id = $1
RETURNING *;

-- name: UpdateIAMUserStatus :exec
UPDATE iam_users
SET status = $2,
    updated_at = now()
WHERE id = $1;

-- name: DeleteIAMUser :exec
UPDATE iam_users
SET status = 'DELETED',
    updated_at = now()
WHERE id = $1;