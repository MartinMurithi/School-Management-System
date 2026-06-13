package http

import (
	"log/slog"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

func TestNew(t *testing.T) {
	log := slog.Default()
	handler := http.NewServeMux()
	srv := New("9999", handler, log, 10*time.Second, 15*time.Second)

	if srv == nil {
		t.Fatal("expected non-nil server")
	}

	if srv.http.Addr != ":9999" {
		t.Errorf("expected :9999, got %s", srv.http.Addr)
	}

	if srv.http.Handler != handler {
		t.Error("handler mismatch")
	}
}

func TestNew_DefaultTimeouts(t *testing.T) {
	log := slog.Default()
	handler := http.NewServeMux()
	srv := New("8000", handler, log, 5*time.Second, 10*time.Second)

	if srv.http.ReadTimeout != 5*time.Second {
		t.Errorf("expected read timeout 5s, got %v", srv.http.ReadTimeout)
	}
	if srv.http.WriteTimeout != 10*time.Second {
		t.Errorf("expected write timeout 10s, got %v", srv.http.WriteTimeout)
	}
}

func TestServer_RoutesWorking(t *testing.T) {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /test", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ok"))
	})

	srv := httptest.NewServer(mux)
	defer srv.Close()

	resp, err := http.Get(srv.URL + "/test")
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Errorf("expected 200, got %d", resp.StatusCode)
	}
}

func TestServer_HealthHandler(t *testing.T) {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	srv := httptest.NewServer(mux)
	defer srv.Close()

	resp, err := http.Get(srv.URL + "/health")
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Errorf("expected 200, got %d", resp.StatusCode)
	}
}

func TestServer_NotFound(t *testing.T) {
	mux := http.NewServeMux()
	srv := httptest.NewServer(mux)
	defer srv.Close()

	resp, err := http.Get(srv.URL + "/nonexistent")
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusNotFound {
		t.Errorf("expected 404, got %d", resp.StatusCode)
	}
}

func TestNew_NilHandler(t *testing.T) {
	log := slog.Default()
	srv := New("9000", nil, log, 10*time.Second, 15*time.Second)

	if srv.http.Handler != nil {
		t.Error("expected nil handler")
	}
}
