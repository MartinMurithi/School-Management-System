package entit

import (
	"time"


	"github.com/MartinMurithi/School-Management-System/school-system/internal/iam/domain/identity/valueobjects"
)

type UserStatus string

const(
	PENDING UserStatus = "pending"
	ACTIVE UserStatus = "active"
	DEACTIVATED UserStatus = "deactivated"
)


type User struct{
	ID        UserID
	Email     Email
	Phone     PhoneNumber
	Status    UserStatus
	CreatedAt time.Time
	UpdatedAt time.Time
}