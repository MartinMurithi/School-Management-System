package main

import (
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"
)

func TestLoadEnvFile_LoadsVariables(t *testing.T) {
	content := "DATABASE_URL=postgres://localhost:5432/test\nPORT=9000\n"
	path := t.TempDir() + "/.env"
	if err := os.WriteFile(path, []byte(content), 0644); err != nil {
		t.Fatal(err)
	}

	loadEnvFile(path)

	if got := os.Getenv("DATABASE_URL"); got != "postgres://localhost:5432/test" {
		t.Errorf("expected DATABASE_URL, got %s", got)
	}
	if got := os.Getenv("PORT"); got != "9000" {
		t.Errorf("expected PORT=9000, got %s", got)
	}

	t.Cleanup(func() {
		os.Unsetenv("DATABASE_URL")
		os.Unsetenv("PORT")
	})
}

func TestLoadEnvFile_DoesNotOverrideExisting(t *testing.T) {
	os.Setenv("PORT", "5000")
	defer os.Unsetenv("PORT")

	content := "PORT=9000\n"
	path := t.TempDir() + "/.env"
	os.WriteFile(path, []byte(content), 0644)

	loadEnvFile(path)

	if got := os.Getenv("PORT"); got != "5000" {
		t.Errorf("expected existing PORT, got %s", got)
	}
}

func TestLoadEnvFile_SkipsCommentsAndEmptyLines(t *testing.T) {
	content := "# comment\n\nDATABASE_URL=postgres://localhost:5432/test\n"
	path := t.TempDir() + "/.env"
	os.WriteFile(path, []byte(content), 0644)

	loadEnvFile(path)

	if got := os.Getenv("DATABASE_URL"); got != "postgres://localhost:5432/test" {
		t.Errorf("expected DATABASE_URL, got %s", got)
	}

	t.Cleanup(func() { os.Unsetenv("DATABASE_URL") })
}

func TestLoadEnvFile_StripsQuotes(t *testing.T) {
	content := "DATABASE_URL='postgres://localhost:5432/test'\n"
	path := t.TempDir() + "/.env"
	os.WriteFile(path, []byte(content), 0644)

	loadEnvFile(path)

	if got := os.Getenv("DATABASE_URL"); got != "postgres://localhost:5432/test" {
		t.Errorf("expected unquoted value, got %s", got)
	}
	if strings.HasPrefix(os.Getenv("DATABASE_URL"), "'") {
		t.Error("value should not contain quotes")
	}

	t.Cleanup(func() { os.Unsetenv("DATABASE_URL") })
}

func TestLoadEnvFile_SkipsMalformedLines(t *testing.T) {
	content := "KEY_WITHOUT_VALUE\n=value\nDATABASE_URL=postgres://localhost:5432/test\n"
	path := t.TempDir() + "/.env"
	os.WriteFile(path, []byte(content), 0644)

	loadEnvFile(path)

	if got := os.Getenv("DATABASE_URL"); got != "postgres://localhost:5432/test" {
		t.Errorf("expected DATABASE_URL, got %s", got)
	}

	t.Cleanup(func() { os.Unsetenv("DATABASE_URL") })
}

func TestLoadEnvFile_MissingFileDoesNothing(t *testing.T) {
	loadEnvFile("/nonexistent/.env")

	// should not panic
}

func TestLoadEnvFile_TrimsSpaces(t *testing.T) {
	content := "  DATABASE_URL  =  postgres://localhost:5432/test  \n"
	path := t.TempDir() + "/.env"
	os.WriteFile(path, []byte(content), 0644)

	loadEnvFile(path)

	if got := os.Getenv("DATABASE_URL"); got != "postgres://localhost:5432/test" {
		t.Errorf("expected trimmed value, got %s", got)
	}

	t.Cleanup(func() { os.Unsetenv("DATABASE_URL") })
}

func TestSwaggerUI_SetsContentType(t *testing.T) {
	w := httptest.NewRecorder()
	r := httptest.NewRequest("GET", "/swagger", nil)

	swaggerUI(w, r)

	resp := w.Result()
	defer resp.Body.Close()

	ct := resp.Header.Get("Content-Type")
	if ct != "text/html; charset=utf-8" {
		t.Errorf("expected text/html; charset=utf-8, got %s", ct)
	}
}

func TestSwaggerUI_StatusOK(t *testing.T) {
	w := httptest.NewRecorder()
	r := httptest.NewRequest("GET", "/swagger", nil)

	swaggerUI(w, r)

	resp := w.Result()
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Errorf("expected 200, got %d", resp.StatusCode)
	}
}

func TestSwaggerUI_ContainsSwaggerUI(t *testing.T) {
	w := httptest.NewRecorder()
	r := httptest.NewRequest("GET", "/swagger", nil)

	swaggerUI(w, r)

	body := w.Body.String()
	if !strings.Contains(body, "swagger-ui") {
		t.Error("response should contain swagger-ui")
	}
	if !strings.Contains(body, "/api/openapi.yaml") {
		t.Error("response should reference openapi spec")
	}
	if !strings.Contains(body, "SwaggerUIBundle") {
		t.Error("response should contain SwaggerUIBundle")
	}
}
