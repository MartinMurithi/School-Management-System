package iamdb

import (
	"context"
	"errors"

	entit "github.com/MartinMurithi/School-Management-System/internal/iam/domain/identity/entity"
	valueobjects "github.com/MartinMurithi/School-Management-System/internal/iam/domain/identity/value_objects"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
)

type UserRepository struct {
	q *Queries
}

func NewUserRepository(q *Queries) *UserRepository {
	return &UserRepository{q: q}
}

func (r *UserRepository) Create(ctx context.Context, user *entit.User) error {
	params := CreateIAMUserParams{
		ID:     pgtype.UUID{Bytes: user.ID.UUID(), Valid: true},
		Email:  string(user.Email),
		Phone:  pgtype.Text{String: string(user.Phone), Valid: user.Phone != ""},
		Status: string(user.Status),
	}

	_, err := r.q.CreateIAMUser(ctx, params)
	return err
}

func (r *UserRepository) GetByID(ctx context.Context, id valueobjects.UserID) (*entit.User, error) {
	dbUser, err := r.q.GetIAMUserByID(ctx, pgtype.UUID{Bytes: id.UUID(), Valid: true})
	if err != nil {
		return nil, err
	}

	return toDomainUser(dbUser)
}

func (r *UserRepository) GetByEmail(ctx context.Context, email valueobjects.Email) (*entit.User, error) {
	dbUser, err := r.q.GetIAMUserByEmail(ctx, string(email))
	if err != nil {
		return nil, err
	}

	return toDomainUser(dbUser)
}

func (r *UserRepository) List(ctx context.Context) ([]entit.User, error) {
	dbUsers, err := r.q.ListIAMUsers(ctx)
	if err != nil {
		return nil, err
	}

	users := make([]entit.User, 0, len(dbUsers))
	for _, dbUser := range dbUsers {
		user, err := toDomainUser(dbUser)
		if err != nil {
			return nil, err
		}
		users = append(users, *user)
	}

	return users, nil
}

func (r *UserRepository) Update(ctx context.Context, user *entit.User) error {
	params := UpdateIAMUserParams{
		ID:    pgtype.UUID{Bytes: user.ID.UUID(), Valid: true},
		Email: string(user.Email),
		Phone: pgtype.Text{String: string(user.Phone), Valid: user.Phone != ""},
	}

	_, err := r.q.UpdateIAMUser(ctx, params)
	return err
}

func (r *UserRepository) UpdateStatus(ctx context.Context, id valueobjects.UserID, status entit.UserStatus) error {
	params := UpdateIAMUserStatusParams{
		ID:     pgtype.UUID{Bytes: id.UUID(), Valid: true},
		Status: string(status),
	}

	return r.q.UpdateIAMUserStatus(ctx, params)
}

func (r *UserRepository) Delete(ctx context.Context, id valueobjects.UserID) error {
	return r.q.DeleteIAMUser(ctx, pgtype.UUID{Bytes: id.UUID(), Valid: true})
}

func toDomainUser(dbUser IamUser) (*entit.User, error) {
	uid, err := valueobjects.NewUserID(uuid.UUID(dbUser.ID.Bytes).String())
	if err != nil {
		return nil, errors.New("failed to parse user id from database")
	}

	email, err := valueobjects.NewEmail(dbUser.Email)
	if err != nil {
		return nil, errors.New("failed to parse email from database")
	}

	var phone valueobjects.PhoneNumber
	if dbUser.Phone.Valid {
		phone = valueobjects.PhoneNumber(dbUser.Phone.String)
	}

	return &entit.User{
		ID:        uid,
		Email:     email,
		Phone:     phone,
		Status:    entit.UserStatus(dbUser.Status),
		CreatedAt: dbUser.CreatedAt.Time,
		UpdatedAt: dbUser.UpdatedAt.Time,
	}, nil
}
