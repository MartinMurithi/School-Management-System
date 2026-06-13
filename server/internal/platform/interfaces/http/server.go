package http

import (
	"context"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

type Server struct {
	http   *http.Server
	logger *slog.Logger
}

func New(port string, handler http.Handler, logger *slog.Logger, readTimeout, writeTimeout time.Duration) *Server {
	return &Server{
		http: &http.Server{
			Addr:         fmt.Sprintf(":%s", port),
			Handler:      handler,
			ReadTimeout:  readTimeout,
			WriteTimeout: writeTimeout,
		},
		logger: logger,
	}
}

func (s *Server) Start() error {
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		s.logger.Info("server starting", "addr", s.http.Addr)
		if err := s.http.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			s.logger.Error("server error", "error", err)
		}
	}()

	sig := <-quit
	s.logger.Info("shutting down", "signal", sig)

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := s.http.Shutdown(ctx); err != nil {
		s.logger.Error("forced shutdown", "error", err)
		return err
	}

	s.logger.Info("server stopped")
	return nil
}
