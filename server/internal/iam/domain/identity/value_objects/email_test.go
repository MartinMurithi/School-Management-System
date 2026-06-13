package valueobjects

import "testing"

func TestNewEmail_Valid(t *testing.T) {
	tests := []struct {
		input string
	}{
		{"test@example.com"},
		{"user@domain.co.ke"},
		{"USER@EXAMPLE.COM"},
		{"  user@example.com  "},
	}

	for _, tt := range tests {
		t.Run(tt.input, func(t *testing.T) {
			email, err := NewEmail(tt.input)
			if err != nil {
				t.Errorf("expected no error, got %v", err)
			}
			if email.String() == "" {
				t.Error("expected non-empty email")
			}
		})
	}
}

func TestNewEmail_Invalid(t *testing.T) {
	tests := []string{
		"",
		"not-an-email",
		"@example.com",
		"user@",
		"user@.com",
		"user@example",
	}

	for _, tt := range tests {
		t.Run(tt, func(t *testing.T) {
			_, err := NewEmail(tt)
			if err == nil {
				t.Error("expected error for invalid email")
			}
		})
	}
}

func TestNewEmail_Normalizes(t *testing.T) {
	email, err := NewEmail("  Test@Example.COM  ")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if email.String() != "test@example.com" {
		t.Errorf("expected lowercase trimmed, got %s", email.String())
	}
}

func TestEmail_String(t *testing.T) {
	email, err := NewEmail("user@example.com")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if email.String() != "user@example.com" {
		t.Errorf("expected user@example.com, got %s", email.String())
	}
}

func TestEmail_Type(t *testing.T) {
	email := Email("test@example.com")
	if string(email) != "test@example.com" {
		t.Errorf("unexpected underlying value")
	}
}
