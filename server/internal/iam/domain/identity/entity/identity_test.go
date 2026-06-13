package entit

import (
	"testing"
	"time"

	valueobjects "github.com/MartinMurithi/School-Management-System/internal/iam/domain/identity/value_objects"
)

func newValidUser(t *testing.T) *User {
	t.Helper()
	id := valueobjects.NewGeneratedUserID()
	email, _ := valueobjects.NewEmail("test@example.com")
	phone, _ := valueobjects.NewPhoneNumber("0712345678")

	user, err := NewUser(id, email, &phone)
	if err != nil {
		t.Fatalf("failed to create user: %v", err)
	}
	return user
}

func TestNewUser(t *testing.T) {
	id := valueobjects.NewGeneratedUserID()
	email, _ := valueobjects.NewEmail("test@example.com")
	phone, _ := valueobjects.NewPhoneNumber("0712345678")

	user, err := NewUser(id, email, &phone)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if user.ID != id {
		t.Error("ID mismatch")
	}
	if user.Email != email {
		t.Error("Email mismatch")
	}
	if user.Phone != phone {
		t.Error("Phone mismatch")
	}
	if user.Status != UserPendingVerification {
		t.Errorf("expected PENDING_VERIFICATION, got %s", user.Status)
	}
	if user.CreatedAt.IsZero() {
		t.Error("expected non-zero CreatedAt")
	}
	if user.UpdatedAt.IsZero() {
		t.Error("expected non-zero UpdatedAt")
	}
}

func TestNewUser_WithoutPhone(t *testing.T) {
	id := valueobjects.NewGeneratedUserID()
	email, _ := valueobjects.NewEmail("test@example.com")

	user, err := NewUser(id, email, nil)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if user.Phone != "" {
		t.Errorf("expected empty phone, got %s", user.Phone)
	}
}

func TestActivate(t *testing.T) {
	user := newValidUser(t)

	if err := user.Activate(); err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if user.Status != UserActive {
		t.Errorf("expected ACTIVE, got %s", user.Status)
	}
}

func TestActivate_AlreadyActive(t *testing.T) {
	user := newValidUser(t)
	user.Activate()

	before := user.UpdatedAt
	time.Sleep(time.Millisecond)

	if err := user.Activate(); err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if user.Status != UserActive {
		t.Errorf("expected ACTIVE, got %s", user.Status)
	}

	if user.UpdatedAt != before {
		t.Error("UpdatedAt should not change when already active")
	}
}

func TestActivate_DeletedUser(t *testing.T) {
	user := newValidUser(t)
	user.Status = UserDeleted

	err := user.Activate()
	if err == nil {
		t.Fatal("expected error for deleted user")
	}
}

func TestSuspend(t *testing.T) {
	user := newValidUser(t)
	user.Activate()

	if err := user.Suspend(); err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if user.Status != UserSuspended {
		t.Errorf("expected SUSPENDED, got %s", user.Status)
	}
}

func TestSuspend_AlreadySuspended(t *testing.T) {
	user := newValidUser(t)
	user.Status = UserSuspended

	before := user.UpdatedAt
	time.Sleep(time.Millisecond)

	if err := user.Suspend(); err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if user.UpdatedAt != before {
		t.Error("UpdatedAt should not change when already suspended")
	}
}

func TestSuspend_DeletedUser(t *testing.T) {
	user := newValidUser(t)
	user.Status = UserDeleted

	err := user.Suspend()
	if err == nil {
		t.Fatal("expected error for deleted user")
	}
}

func TestUserStatusConstants(t *testing.T) {
	if UserActive != "ACTIVE" {
		t.Errorf("expected ACTIVE, got %s", UserActive)
	}
	if UserSuspended != "SUSPENDED" {
		t.Errorf("expected SUSPENDED, got %s", UserSuspended)
	}
	if UserPendingVerification != "PENDING_VERIFICATION" {
		t.Errorf("expected PENDING_VERIFICATION, got %s", UserPendingVerification)
	}
	if UserDeleted != "DELETED" {
		t.Errorf("expected DELETED, got %s", UserDeleted)
	}
}

func TestNewUser_SetsTimestamps(t *testing.T) {
	before := time.Now()
	user := newValidUser(t)
	after := time.Now()

	if user.CreatedAt.Before(before) || user.CreatedAt.After(after) {
		t.Error("CreatedAt should be between before and after")
	}
	if user.UpdatedAt.Before(before) || user.UpdatedAt.After(after) {
		t.Error("UpdatedAt should be between before and after")
	}
}
