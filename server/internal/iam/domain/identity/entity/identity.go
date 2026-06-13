package entit

import (
	"errors"
	"time"

	valueobjects "github.com/MartinMurithi/School-Management-System/internal/iam/domain/identity/value_objects"
)

type UserStatus string

const (
	UserActive              UserStatus = "ACTIVE"
	UserSuspended           UserStatus = "SUSPENDED"
	UserPendingVerification UserStatus = "PENDING_VERIFICATION"
	UserDeleted             UserStatus = "DELETED" //soft delete
)

type User struct {
	ID        valueobjects.UserID
	Email     valueobjects.Email
	Phone     valueobjects.PhoneNumber
	Status    UserStatus
	CreatedAt time.Time
	UpdatedAt time.Time
}

func NewUser(
	id valueobjects.UserID,
	email valueobjects.Email,
	phone *valueobjects.PhoneNumber,
) (*User, error) {

	now := time.Now()

	var p valueobjects.PhoneNumber
	if phone != nil {
		p = *phone
	}

	return &User{
		ID:        id,
		Email:     email,
		Phone:     p,
		Status:    UserPendingVerification,
		CreatedAt: now,
		UpdatedAt: now,
	}, nil
}

func (u *User) Activate() error {
	if u.Status == UserDeleted {
		return errors.New("cannot activate deleted user")
	}

	if u.Status == UserActive {
		return nil
	}

	u.Status = UserActive
	u.UpdatedAt = time.Now()

	return nil
}

func (u *User) Suspend() error {
	if u.Status == UserDeleted {
		return errors.New("cannot suspend deleted user")
	}

	if u.Status == UserSuspended {
		return nil
	}

	u.Status = UserSuspended
	u.UpdatedAt = time.Now()

	return nil
}
