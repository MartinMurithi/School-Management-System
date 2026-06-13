//go:build integration

package iamdb

import (
	"context"
	"os"
	"testing"

	entit "github.com/MartinMurithi/School-Management-System/internal/iam/domain/identity/entity"
	valueobjects "github.com/MartinMurithi/School-Management-System/internal/iam/domain/identity/value_objects"
	"github.com/jackc/pgx/v5/pgxpool"
)

func connectDB(t *testing.T) *Queries {
	t.Helper()
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		t.Skip("DATABASE_URL not set")
	}

	pool, err := pgxpool.New(context.Background(), dsn)
	if err != nil {
		t.Fatalf("failed to connect: %v", err)
	}
	t.Cleanup(pool.Close)

	return New(pool)
}

func newTestUser(t *testing.T) *entit.User {
	t.Helper()
	id := valueobjects.NewGeneratedUserID()
	email, _ := valueobjects.NewEmail(id.String()[:8] + "@test.com")
	phone, _ := valueobjects.NewPhoneNumber("0712345678")

	user, err := entit.NewUser(id, email, &phone)
	if err != nil {
		t.Fatalf("failed to create test user: %v", err)
	}
	return user
}

func TestUserRepository_CreateAndGetByID(t *testing.T) {
	q := connectDB(t)
	repo := NewUserRepository(q)
	ctx := context.Background()

	user := newTestUser(t)
	if err := repo.Create(ctx, user); err != nil {
		t.Fatalf("Create failed: %v", err)
	}

	got, err := repo.GetByID(ctx, user.ID)
	if err != nil {
		t.Fatalf("GetByID failed: %v", err)
	}

	if got.Email != user.Email {
		t.Errorf("email mismatch: got %s, want %s", got.Email, user.Email)
	}
	if got.Status != user.Status {
		t.Errorf("status mismatch: got %s, want %s", got.Status, user.Status)
	}
}

func TestUserRepository_GetByEmail(t *testing.T) {
	q := connectDB(t)
	repo := NewUserRepository(q)
	ctx := context.Background()

	user := newTestUser(t)
	repo.Create(ctx, user)

	got, err := repo.GetByEmail(ctx, user.Email)
	if err != nil {
		t.Fatalf("GetByEmail failed: %v", err)
	}

	if got.ID != user.ID {
		t.Errorf("id mismatch: got %v, want %v", got.ID, user.ID)
	}
}

func TestUserRepository_List(t *testing.T) {
	q := connectDB(t)
	repo := NewUserRepository(q)
	ctx := context.Background()

	a := newTestUser(t)
	b := newTestUser(t)
	repo.Create(ctx, a)
	repo.Create(ctx, b)

	users, err := repo.List(ctx)
	if err != nil {
		t.Fatalf("List failed: %v", err)
	}

	if len(users) < 2 {
		t.Errorf("expected at least 2 users, got %d", len(users))
	}
}

func TestUserRepository_Update(t *testing.T) {
	q := connectDB(t)
	repo := NewUserRepository(q)
	ctx := context.Background()

	user := newTestUser(t)
	repo.Create(ctx, user)

	newEmail, _ := valueobjects.NewEmail("updated@test.com")
	user.Email = newEmail
	user.Phone = ""

	if err := repo.Update(ctx, user); err != nil {
		t.Fatalf("Update failed: %v", err)
	}

	got, _ := repo.GetByID(ctx, user.ID)
	if got.Email != newEmail {
		t.Errorf("email not updated: got %s, want %s", got.Email, newEmail)
	}
}

func TestUserRepository_UpdateStatus(t *testing.T) {
	q := connectDB(t)
	repo := NewUserRepository(q)
	ctx := context.Background()

	user := newTestUser(t)
	repo.Create(ctx, user)

	if err := repo.UpdateStatus(ctx, user.ID, entit.UserActive); err != nil {
		t.Fatalf("UpdateStatus failed: %v", err)
	}

	got, _ := repo.GetByID(ctx, user.ID)
	if got.Status != entit.UserActive {
		t.Errorf("expected ACTIVE, got %s", got.Status)
	}
}

func TestUserRepository_Delete(t *testing.T) {
	q := connectDB(t)
	repo := NewUserRepository(q)
	ctx := context.Background()

	user := newTestUser(t)
	repo.Create(ctx, user)

	if err := repo.Delete(ctx, user.ID); err != nil {
		t.Fatalf("Delete failed: %v", err)
	}

	got, _ := repo.GetByID(ctx, user.ID)
	if got.Status != entit.UserDeleted {
		t.Errorf("expected DELETED, got %s", got.Status)
	}
}
