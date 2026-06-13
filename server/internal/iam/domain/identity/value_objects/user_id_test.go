package valueobjects

import (
	"testing"

	"github.com/google/uuid"
)

func TestNewUserID_Valid(t *testing.T) {
	id := uuid.New().String()
	uid, err := NewUserID(id)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if uid.String() != id {
		t.Errorf("expected %s, got %s", id, uid.String())
	}
}

func TestNewUserID_Invalid(t *testing.T) {
	tests := []string{
		"",
		"not-a-uuid",
		"12345",
		"00000000-0000-0000-0000-000000000000",
	}

	for _, tt := range tests {
		t.Run(tt, func(t *testing.T) {
			_, err := NewUserID(tt)
			if err == nil {
				t.Error("expected error for invalid user id")
			}
		})
	}
}

func TestNewGeneratedUserID(t *testing.T) {
	uid := NewGeneratedUserID()
	if uid.String() == "" {
		t.Error("expected non-empty generated id")
	}

	if uid == UserID(uuid.Nil) {
		t.Error("expected non-nil generated id")
	}
}

func TestUserID_UUID(t *testing.T) {
	original := uuid.New()
	uid := UserID(original)

	if uid.UUID() != original {
		t.Errorf("UUID() returned different value")
	}
}

func TestUserID_String_RoundTrip(t *testing.T) {
	original := NewGeneratedUserID()
	str := original.String()

	parsed, err := NewUserID(str)
	if err != nil {
		t.Fatalf("failed to parse back: %v", err)
	}

	if parsed != original {
		t.Error("string round-trip failed")
	}
}

func TestUserID_Uniqueness(t *testing.T) {
	a := NewGeneratedUserID()
	b := NewGeneratedUserID()

	if a == b {
		t.Error("two generated ids should not be equal")
	}
}
