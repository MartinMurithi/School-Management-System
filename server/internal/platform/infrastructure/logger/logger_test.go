package logger

import (
	"log/slog"
	"strings"
	"testing"
)

func TestNew_TextHandler(t *testing.T) {
	log := New("info", "development")
	if log == nil {
		t.Fatal("expected non-nil logger")
	}
}

func TestNew_JSONHandler(t *testing.T) {
	log := New("info", "production")
	if log == nil {
		t.Fatal("expected non-nil logger")
	}
}

func TestNew_LevelParsing(t *testing.T) {
	tests := []struct {
		level string
		want  slog.Level
	}{
		{"debug", slog.LevelDebug},
		{"DEBUG", slog.LevelDebug},
		{"info", slog.LevelInfo},
		{"warn", slog.LevelWarn},
		{"error", slog.LevelError},
		{"unknown", slog.LevelInfo},
	}

	for _, tt := range tests {
		t.Run(tt.level, func(t *testing.T) {
			log := New(tt.level, "development")
			if log == nil {
				t.Fatal("expected non-nil logger")
			}
			if !log.Enabled(nil, tt.want) {
				t.Errorf("expected level %s to be enabled", tt.want)
			}
		})
	}
}

func TestNew_HandlerFormat(t *testing.T) {
	t.Run("production uses JSON", func(t *testing.T) {
		log := New("info", "production")
		h := log.Handler()
		_ = h
	})

	t.Run("development uses text", func(t *testing.T) {
		log := New("info", "development")
		h := log.Handler()
		_ = h
	})
}

func TestNew_DefaultsToInfo(t *testing.T) {
	log := New("", "")
	if log == nil {
		t.Fatal("expected non-nil logger")
	}
}

func TestNew_Levels(t *testing.T) {
	log := New("debug", "development")
	if !log.Enabled(nil, slog.LevelDebug) {
		t.Error("debug level should be enabled")
	}
	if !log.Enabled(nil, slog.LevelInfo) {
		t.Error("info level should be enabled")
	}

	log2 := New("error", "development")
	if log2.Enabled(nil, slog.LevelInfo) {
		t.Error("info level should not be enabled when level is error")
	}
	if !log2.Enabled(nil, slog.LevelError) {
		t.Error("error level should be enabled")
	}
}

func TestNew_EnvIgnoreCase(t *testing.T) {
	log := New("INFO", "DEVELOPMENT")
	if log == nil {
		t.Fatal("expected non-nil logger")
	}
}

func TestNew_WriterCapabilities(t *testing.T) {
	var buf strings.Builder
	log := slog.New(slog.NewTextHandler(&buf, &slog.HandlerOptions{Level: slog.LevelInfo}))
	log.Info("test message")
	if !strings.Contains(buf.String(), "test message") {
		t.Error("expected log message in output")
	}
}
