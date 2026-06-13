//go:build integration

package postgres

import (
	"os"
	"testing"
)

func TestNew_Success(t *testing.T) {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		t.Skip("DATABASE_URL not set")
	}

	db, err := New(dsn)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	defer db.Close()

	if db.Pool == nil {
		t.Fatal("expected non-nil pool")
	}
}

func TestNew_MissingURL(t *testing.T) {
	_, err := New("")
	if err == nil {
		t.Fatal("expected error for empty URL")
	}
}

func TestNew_InvalidURL(t *testing.T) {
	_, err := New("not-a-valid-url")
	if err == nil {
		t.Fatal("expected error for invalid URL")
	}
}
