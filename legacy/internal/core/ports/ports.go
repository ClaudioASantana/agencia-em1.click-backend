package ports

import (
	"bureau-backend/internal/core/domain"
	"context"
)

type UserRepository interface {
	CreateUser(ctx context.Context, user domain.User) (domain.User, error)
	GetUserByEmail(ctx context.Context, email string) (domain.User, error)
	Count(ctx context.Context) (int64, error)
	ListUsers(ctx context.Context, limit, offset int32) ([]domain.User, error)
	GetUser(ctx context.Context, id int64) (domain.User, error)
	UpdateUser(ctx context.Context, id int64, name, email string, active *bool) (domain.User, error)
	DeleteUser(ctx context.Context, id int64) error
	// Add other methods as needed: FindByID, etc.
}

type AuthService interface {
	Register(ctx context.Context, user domain.User) (domain.User, error)
	Login(ctx context.Context, email, password string) (string, error)
}
