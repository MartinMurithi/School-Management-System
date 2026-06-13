package logger

import (
	"io"
	"log/slog"
	"os"
	"strings"
)

func New(level, env string) *slog.Logger {
	var lvl slog.Level
	switch strings.ToLower(level) {
	case "debug":
		lvl = slog.LevelDebug
	case "info":
		lvl = slog.LevelInfo
	case "warn":
		lvl = slog.LevelWarn
	case "error":
		lvl = slog.LevelError
	default:
		lvl = slog.LevelInfo
	}

	var w io.Writer = os.Stdout
	var handler slog.Handler

	if env == "production" {
		handler = slog.NewJSONHandler(w, &slog.HandlerOptions{Level: lvl})
	} else {
		handler = slog.NewTextHandler(w, &slog.HandlerOptions{Level: lvl})
	}

	return slog.New(handler)
}
