package valueobjects

import (
	"errors"
	"regexp"
	"strings"
)

type PhoneNumber string

var phoneRegex = regexp.MustCompile(`^07\d{8}$`)

func NewPhoneNumber(phone string) (PhoneNumber, error) {
	phone = strings.TrimSpace(phone)

	if !phoneRegex.MatchString(phone) {
		return "", errors.New("invalid phone number")
	}

	return PhoneNumber(phone), nil
}

func (p PhoneNumber) String() string {
	return string(p)
}