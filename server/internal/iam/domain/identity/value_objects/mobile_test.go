package valueobjects

import "testing"

func TestNewPhoneNumber_Valid(t *testing.T) {
	tests := []string{
		"0712345678",
		"0798765432",
		" 0712345678 ",
	}

	for _, tt := range tests {
		t.Run(tt, func(t *testing.T) {
			phone, err := NewPhoneNumber(tt)
			if err != nil {
				t.Errorf("expected no error, got %v", err)
			}
			if phone.String() == "" {
				t.Error("expected non-empty phone")
			}
		})
	}
}

func TestNewPhoneNumber_Invalid(t *testing.T) {
	tests := []string{
		"",
		"071234567",
		"07123456789",
		"0112345678",
		"abcdefghij",
		"+254712345678",
		"0712-345-678",
	}

	for _, tt := range tests {
		t.Run(tt, func(t *testing.T) {
			_, err := NewPhoneNumber(tt)
			if err == nil {
				t.Errorf("expected error for invalid phone: %s", tt)
			}
		})
	}
}

func TestPhoneNumber_String(t *testing.T) {
	phone, err := NewPhoneNumber("0712345678")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if phone.String() != "0712345678" {
		t.Errorf("expected 0712345678, got %s", phone.String())
	}
}

func TestPhoneNumber_Trims(t *testing.T) {
	phone, err := NewPhoneNumber("  0712345678  ")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if phone.String() != "0712345678" {
		t.Errorf("expected trimmed value, got %s", phone.String())
	}
}
