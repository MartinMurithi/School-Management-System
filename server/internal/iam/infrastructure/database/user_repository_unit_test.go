package iamdb

import (
	"testing"
	"time"

	entit "github.com/MartinMurithi/School-Management-System/internal/iam/domain/identity/entity"
	"github.com/jackc/pgx/v5/pgtype"
)

func validIamUser() IamUser {
	return IamUser{
		ID:        pgtype.UUID{Bytes: [16]byte{0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15}, Valid: true},
		Email:     "test@example.com",
		Phone:     pgtype.Text{String: "0712345678", Valid: true},
		Status:    string(entit.UserPendingVerification),
		CreatedAt: pgtype.Timestamptz{Time: time.Now(), Valid: true},
		UpdatedAt: pgtype.Timestamptz{Time: time.Now(), Valid: true},
	}
}

func TestToDomainUser_Success(t *testing.T) {
	dbUser := validIamUser()

	user, err := toDomainUser(dbUser)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if user.Email.String() != "test@example.com" {
		t.Errorf("email mismatch: got %s", user.Email)
	}
	if user.Phone.String() != "0712345678" {
		t.Errorf("phone mismatch: got %s", user.Phone)
	}
	if user.Status != entit.UserPendingVerification {
		t.Errorf("status mismatch: got %s", user.Status)
	}
}

func TestToDomainUser_EmptyPhone(t *testing.T) {
	dbUser := validIamUser()
	dbUser.Phone = pgtype.Text{Valid: false}

	user, err := toDomainUser(dbUser)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if user.Phone != "" {
		t.Errorf("expected empty phone, got %s", user.Phone)
	}
}

func TestToDomainUser_ActiveStatus(t *testing.T) {
	dbUser := validIamUser()
	dbUser.Status = "ACTIVE"

	user, err := toDomainUser(dbUser)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if user.Status != entit.UserActive {
		t.Errorf("expected ACTIVE, got %s", user.Status)
	}
}

func TestToDomainUser_SuspendedStatus(t *testing.T) {
	dbUser := validIamUser()
	dbUser.Status = "SUSPENDED"

	user, err := toDomainUser(dbUser)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if user.Status != entit.UserSuspended {
		t.Errorf("expected SUSPENDED, got %s", user.Status)
	}
}

func TestToDomainUser_DeletedStatus(t *testing.T) {
	dbUser := validIamUser()
	dbUser.Status = "DELETED"

	user, err := toDomainUser(dbUser)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if user.Status != entit.UserDeleted {
		t.Errorf("expected DELETED, got %s", user.Status)
	}
}

func TestToDomainUser_InvalidUUID(t *testing.T) {
	dbUser := validIamUser()
	dbUser.ID = pgtype.UUID{Valid: true}

	_, err := toDomainUser(dbUser)
	if err == nil {
		t.Fatal("expected error for nil UUID")
	}
}

func TestToDomainUser_InvalidEmail(t *testing.T) {
	dbUser := validIamUser()
	dbUser.Email = "not-an-email"

	_, err := toDomainUser(dbUser)
	if err == nil {
		t.Fatal("expected error for invalid email")
	}
}

func TestToDomainUser_NullUUID(t *testing.T) {
	dbUser := validIamUser()
	dbUser.ID = pgtype.UUID{Valid: false}

	_, err := toDomainUser(dbUser)
	if err == nil {
		t.Fatal("expected error for invalid uuid")
	}
}

func TestToDomainUser_Timestamps(t *testing.T) {
	now := time.Now()
	dbUser := validIamUser()
	dbUser.CreatedAt = pgtype.Timestamptz{Time: now, Valid: true}
	dbUser.UpdatedAt = pgtype.Timestamptz{Time: now, Valid: true}

	user, err := toDomainUser(dbUser)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if !user.CreatedAt.Equal(now) {
		t.Errorf("created_at mismatch")
	}
	if !user.UpdatedAt.Equal(now) {
		t.Errorf("updated_at mismatch")
	}
}

func TestToDomainUser_CapitalizedEmail(t *testing.T) {
	dbUser := validIamUser()
	dbUser.Email = "Test@Example.COM"

	user, err := toDomainUser(dbUser)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if user.Email.String() != "test@example.com" {
		t.Errorf("expected lowercase email, got %s", user.Email)
	}
}
