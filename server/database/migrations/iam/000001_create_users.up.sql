CREATE TABLE IF NOT EXISTS iam_users (
    id UUID PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    phone TEXT UNIQUE,
    status TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);