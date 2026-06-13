package valueobjects

import (
	"errors"

	"github.com/google/uuid"
)

type UserID uuid.UUID

func NewUserID(id string) (UserID, error) {
	parsed, err := uuid.Parse(id)
	if err != nil {
		return UserID(uuid.Nil), errors.New("invalid user id")
	}

	if parsed == uuid.Nil {
		return UserID(uuid.Nil), errors.New("user id cannot be nil")
	}

	return UserID(parsed), nil
}

func (id UserID) String() string {
	return uuid.UUID(id).String()
}

func (id UserID) UUID() uuid.UUID {
	return uuid.UUID(id)
}

func NewGeneratedUserID() UserID {
	return UserID(uuid.New())
}
