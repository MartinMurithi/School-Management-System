package repository

import (
	"context"

	entit "github.com/MartinMurithi/School-Management-System/internal/iam/domain/identity/entity"
	valueobjects "github.com/MartinMurithi/School-Management-System/internal/iam/domain/identity/value_objects"
)

type UserRepository interface {
	Create(ctx context.Context, user *entit.User) error
	GetByID(ctx context.Context, id valueobjects.UserID) (*entit.User, error)
	GetByEmail(ctx context.Context, email valueobjects.Email) (*entit.User, error)
	List(ctx context.Context) ([]entit.User, error)
	Update(ctx context.Context, user *entit.User) error
	UpdateStatus(ctx context.Context, id valueobjects.UserID, status entit.UserStatus) error
	Delete(ctx context.Context, id valueobjects.UserID) error
}
