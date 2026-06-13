CREATE TABLE iam_users (
    id UUID PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    phone TEXT UNIQUE,
    status TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);