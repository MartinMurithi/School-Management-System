package postgres

import (
	"context"
	"fmt"
	"log/slog"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"
)

func (db *DB) RunMigrations(migrationsDir string) error {
	entries, err := os.ReadDir(migrationsDir)
	if err != nil {
		return fmt.Errorf("read migrations dir %s: %w", migrationsDir, err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if _, err := db.Pool.Exec(ctx, `
		CREATE TABLE IF NOT EXISTS schema_migrations (
			version BIGINT PRIMARY KEY,
			dirty BOOLEAN NOT NULL DEFAULT false
		)
	`); err != nil {
		return fmt.Errorf("create migrations table: %w", err)
	}

	for _, entry := range entries {
		if !entry.IsDir() {
			continue
		}

		if err := db.runModuleMigrations(ctx, filepath.Join(migrationsDir, entry.Name())); err != nil {
			return fmt.Errorf("module %s: %w", entry.Name(), err)
		}
	}

	return nil
}

func (db *DB) runModuleMigrations(ctx context.Context, dir string) error {
	entries, err := os.ReadDir(dir)
	if err != nil {
		return fmt.Errorf("read dir: %w", err)
	}

	var upFiles []string
	for _, e := range entries {
		if !e.IsDir() && strings.HasSuffix(e.Name(), ".up.sql") {
			upFiles = append(upFiles, e.Name())
		}
	}
	sort.Strings(upFiles)

	for _, name := range upFiles {
		var version int64
		if _, err := fmt.Sscanf(name, "%06d", &version); err != nil {
			return fmt.Errorf("parse version from %s: %w", name, err)
		}

		var applied bool
		if err := db.Pool.QueryRow(ctx, "SELECT EXISTS(SELECT 1 FROM schema_migrations WHERE version = $1)", version).Scan(&applied); err != nil {
			return fmt.Errorf("check migration %d: %w", version, err)
		}
		if applied {
			continue
		}

		content, err := os.ReadFile(filepath.Join(dir, name))
		if err != nil {
			return fmt.Errorf("read %s: %w", name, err)
		}

		if _, err := db.Pool.Exec(ctx, string(content)); err != nil {
			return fmt.Errorf("apply %s: %w", name, err)
		}

		if _, err := db.Pool.Exec(ctx, "INSERT INTO schema_migrations (version, dirty) VALUES ($1, false)", version); err != nil {
			return fmt.Errorf("record migration %s: %w", name, err)
		}

		slog.Info("applied migration", "file", name)
	}

	return nil
}
