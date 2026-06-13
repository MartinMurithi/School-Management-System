package config

import (
	"os"
	"testing"
)

func TestLoad_Success(t *testing.T) {
	os.Setenv("DATABASE_URL", "postgres://localhost:5432/test?sslmode=disable")
	os.Setenv("PORT", "9000")
	os.Setenv("ENVIRONMENT", "production")
	os.Setenv("LOG_LEVEL", "debug")
	t.Cleanup(func() {
		os.Unsetenv("DATABASE_URL")
		os.Unsetenv("PORT")
		os.Unsetenv("ENVIRONMENT")
		os.Unsetenv("LOG_LEVEL")
	})

	cfg, err := Load()
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if cfg.Port != "9000" {
		t.Errorf("expected port 9000, got %s", cfg.Port)
	}
	if cfg.Environment != "production" {
		t.Errorf("expected production, got %s", cfg.Environment)
	}
	if cfg.LogLevel != "debug" {
		t.Errorf("expected debug, got %s", cfg.LogLevel)
	}
	if cfg.DatabaseURL != "postgres://localhost:5432/test?sslmode=disable" {
		t.Errorf("unexpected database url: %s", cfg.DatabaseURL)
	}
}

func TestLoad_Defaults(t *testing.T) {
	os.Setenv("DATABASE_URL", "postgres://localhost:5432/test?sslmode=disable")
	t.Cleanup(func() {
		os.Unsetenv("DATABASE_URL")
	})

	cfg, err := Load()
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if cfg.Port != "3200" {
		t.Errorf("expected default port 3200, got %s", cfg.Port)
	}
	if cfg.Environment != "development" {
		t.Errorf("expected default development, got %s", cfg.Environment)
	}
	if cfg.LogLevel != "info" {
		t.Errorf("expected default info, got %s", cfg.LogLevel)
	}
}

func TestLoad_MissingDatabaseURL(t *testing.T) {
	os.Unsetenv("DATABASE_URL")

	_, err := Load()
	if err == nil {
		t.Fatal("expected error for missing DATABASE_URL, got nil")
	}
}

func TestLoad_InvalidPort(t *testing.T) {
	os.Setenv("DATABASE_URL", "postgres://localhost:5432/test?sslmode=disable")
	os.Setenv("PORT", "not-a-number")
	t.Cleanup(func() {
		os.Unsetenv("DATABASE_URL")
		os.Unsetenv("PORT")
	})

	_, err := Load()
	if err == nil {
		t.Fatal("expected error for invalid PORT, got nil")
	}
}

func TestGetEnv(t *testing.T) {
	os.Unsetenv("TEST_VAR")

	got := getEnv("TEST_VAR", "fallback")
	if got != "fallback" {
		t.Errorf("expected fallback, got %s", got)
	}

	os.Setenv("TEST_VAR", "actual")
	t.Cleanup(func() { os.Unsetenv("TEST_VAR") })

	got = getEnv("TEST_VAR", "fallback")
	if got != "actual" {
		t.Errorf("expected actual, got %s", got)
	}
}
