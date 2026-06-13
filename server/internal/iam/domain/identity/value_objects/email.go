package valueobjects

import (
	"errors"
	"regexp"
	"strings"
)

type Email string

var emailRegex = regexp.MustCompile(`^[^\s@]+@[^\s@]+\.[^\s@]+$`)

func NewEmail(email string) (Email, error) {
	email = strings.TrimSpace(strings.ToLower(email))

	if !emailRegex.MatchString(email) {
		return "", errors.New("invalid email format")
	}

	return Email(email), nil
}

func (email Email) String() string {
	return string(email)
}
