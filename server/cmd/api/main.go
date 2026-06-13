package main

import (
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"strings"

	"github.com/MartinMurithi/School-Management-System/database/postgres"
	"github.com/MartinMurithi/School-Management-System/internal/platform/infrastructure/config"
	"github.com/MartinMurithi/School-Management-System/internal/platform/infrastructure/logger"
	httppkg "github.com/MartinMurithi/School-Management-System/internal/platform/interfaces/http"
)

func main() {
	loadEnvFile(".env")

	cfg, err := config.Load()
	if err != nil {
		fmt.Fprintf(os.Stderr, "failed to load config: %v\n", err)
		os.Exit(1)
	}

	log := logger.New(cfg.LogLevel, cfg.Environment)
	slog.SetDefault(log)

	log.Info("starting school management system",
		"port", cfg.Port,
		"env", cfg.Environment,
	)

	db, err := postgres.New(cfg.DatabaseURL)

	if err != nil {
		log.Warn("starting without database", "error", err)
	} else {
		defer db.Close()
		log.Info("database connected")

		if err := db.RunMigrations("database/migrations"); err != nil {
			log.Error("failed to run migrations", "error", err)
			os.Exit(1)
		}
	}

	openapiSpec, err := os.ReadFile("api/openapi/openapi.yaml")
	if err != nil {
		log.Warn("failed to load openapi spec", "error", err)
	}

	mux := http.NewServeMux()

	mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
		if db != nil {
			w.WriteHeader(http.StatusOK)
			fmt.Fprintln(w, "OK")
		} else {
			w.WriteHeader(http.StatusServiceUnavailable)
			fmt.Fprintln(w, "database unavailable")
		}
	})

	if openapiSpec != nil {
		mux.HandleFunc("GET /api/openapi.yaml", func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/x-yaml")
			w.Write(openapiSpec)
		})
		mux.HandleFunc("GET /swagger", swaggerUI)
		log.Info("swagger UI available", "url", "/swagger")
	}

	srv := httppkg.New(cfg.Port, mux, log, cfg.ReadTimeout, cfg.WriteTimeout)
	log.Info("server initialized", "addr", fmt.Sprintf(":%s", cfg.Port))

	if err := srv.Start(); err != nil {
		log.Error("server error", "error", err)
		os.Exit(1)
	}
}

func swaggerUI(w http.ResponseWriter, r *http.Request) {
	html := `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>School Management System API</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js" crossorigin></script>
  <script>
    SwaggerUIBundle({
      url: "/api/openapi.yaml",
      dom_id: "#swagger-ui",
    });
  </script>
</body>
</html>`
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	fmt.Fprint(w, html)
}

func loadEnvFile(path string) {
	data, err := os.ReadFile(path)
	if err != nil {
		return
	}

	for _, line := range strings.Split(string(data), "\n") {
		line = strings.TrimSpace(line)
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}

		parts := strings.SplitN(line, "=", 2)
		if len(parts) != 2 {
			continue
		}

		key := strings.TrimSpace(parts[0])
		val := strings.Trim(strings.TrimSpace(parts[1]), "'\"")

		if os.Getenv(key) == "" {
			os.Setenv(key, val)
		}
	}
}
