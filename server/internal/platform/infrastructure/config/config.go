package config

import (
	"fmt"
	"os"
	"strconv"
	"time"
)

type Config struct {
	Port            string
	Environment     string
	LogLevel        string
	DatabaseURL     string
	ShutdownTimeout time.Duration
	ReadTimeout     time.Duration
	WriteTimeout    time.Duration
}

func Load() (*Config, error) {
	port := getEnv("PORT", "3200")
	if _, err := strconv.Atoi(port); err != nil {
		return nil, fmt.Errorf("invalid PORT: %s", port)
	}

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		return nil, fmt.Errorf("DATABASE_URL is required")
	}

	return &Config{
		Port:            port,
		Environment:     getEnv("ENVIRONMENT", "development"),
		LogLevel:        getEnv("LOG_LEVEL", "info"),
		DatabaseURL:     dbURL,
		ShutdownTimeout: 30 * time.Second,
		ReadTimeout:     10 * time.Second,
		WriteTimeout:    15 * time.Second,
	}, nil
}

func getEnv(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}
