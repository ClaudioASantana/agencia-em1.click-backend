package services

import (
	"bureau-backend/internal/core/domain"
	"bureau-backend/internal/core/ports"
	"context"

	"golang.org/x/crypto/bcrypt"
)

type UserService struct {
	repo ports.UserRepository
}

func NewUserService(repo ports.UserRepository) *UserService {
	return &UserService{
		repo: repo,
	}
}

func (s *UserService) ListUsers(ctx context.Context, limit, offset int32) ([]domain.User, error) {
	return s.repo.ListUsers(ctx, limit, offset)
}

func (s *UserService) GetUser(ctx context.Context, id int64) (domain.User, error) {
	return s.repo.GetUser(ctx, id)
}

func (s *UserService) UpdateUser(ctx context.Context, id int64, name, email string, active *bool) (domain.User, error) {
	// Add business logic here if needed (e.g. valid email check)
	return s.repo.UpdateUser(ctx, id, name, email, active)
}

func (s *UserService) CreateUser(ctx context.Context, name, email, password string, active *bool) (domain.User, error) {
	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return domain.User{}, err
	}
	user := domain.User{
		Name:     name,
		Email:    email,
		Password: string(hashed),
		Active:   active != nil && *active,
	}
	return s.repo.CreateUser(ctx, user)
}

func (s *UserService) DeleteUser(ctx context.Context, id int64) error {
	return s.repo.DeleteUser(ctx, id)
}
