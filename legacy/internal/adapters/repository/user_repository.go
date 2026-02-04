package repository

import (
	"bureau-backend/internal/core/domain"
	"context"
)

type UserRepository struct {
	queries *Queries
}

func NewUserRepository(db DBTX) *UserRepository {
	return &UserRepository{
		queries: New(db),
	}
}

func (r *UserRepository) CreateUser(ctx context.Context, u domain.User) (domain.User, error) {
	active := u.Active

	created, err := r.queries.CreateUser(ctx, CreateUserParams{
		Name:         u.Name,
		Email:        u.Email,
		PasswordHash: u.Password, // Assuming domain.User.Password holds the hash here? No, service should hash it. But repo expects hash.
		// Wait, domain user password usually holds plain text in input, repository expects hash.
		// I will assume the Service hashes it and puts it into domain.User.Password before calling CreateUser.
		// Or I should have a separate field.
		Active: &active,
	})
	if err != nil {
		return domain.User{}, err
	}

	return domain.User{
		ID:        created.ID,
		Name:      created.Name,
		Email:     created.Email,
		Password:  created.PasswordHash,
		Active:    *created.Active,
		CreatedAt: created.CreatedAt,
		UpdatedAt: created.UpdatedAt,
	}, nil
}

func (r *UserRepository) GetUserByEmail(ctx context.Context, email string) (domain.User, error) {
	user, err := r.queries.GetUserByEmail(ctx, email)
	if err != nil {
		return domain.User{}, err
	}
	return domain.User{
		ID:        user.ID,
		Name:      user.Name,
		Email:     user.Email,
		Password:  user.PasswordHash, // Return hash so service can compare
		Active:    *user.Active,
		CreatedAt: user.CreatedAt,
	}, nil
}

func (r *UserRepository) Count(ctx context.Context) (int64, error) {
	return r.queries.CountUsers(ctx)
}

func (r *UserRepository) ListUsers(ctx context.Context, limit, offset int32) ([]domain.User, error) {
	users, err := r.queries.ListUsers(ctx, ListUsersParams{
		Limit:  limit,
		Offset: offset,
	})
	if err != nil {
		return nil, err
	}

	domainUsers := []domain.User{}
	for _, u := range users {
		domainUsers = append(domainUsers, domain.User{
			ID:        u.ID,
			Name:      u.Name,
			Email:     u.Email,
			Password:  u.PasswordHash,
			Active:    *u.Active,
			CreatedAt: u.CreatedAt,
			UpdatedAt: u.UpdatedAt,
		})
	}
	return domainUsers, nil
}

func (r *UserRepository) GetUser(ctx context.Context, id int64) (domain.User, error) {
	u, err := r.queries.GetUser(ctx, id)
	if err != nil {
		return domain.User{}, err
	}
	return domain.User{
		ID:        u.ID,
		Name:      u.Name,
		Email:     u.Email,
		Password:  u.PasswordHash,
		Active:    *u.Active,
		CreatedAt: u.CreatedAt,
		UpdatedAt: u.UpdatedAt,
	}, nil
}

func (r *UserRepository) UpdateUser(ctx context.Context, id int64, name, email string, active *bool) (domain.User, error) {
	u, err := r.queries.UpdateUser(ctx, UpdateUserParams{
		ID:     id,
		Name:   name,
		Email:  email,
		Active: active,
	})
	if err != nil {
		return domain.User{}, err
	}

	return domain.User{
		ID:        u.ID,
		Name:      u.Name,
		Email:     u.Email,
		Password:  u.PasswordHash,
		Active:    *u.Active,
		CreatedAt: u.CreatedAt,
		UpdatedAt: u.UpdatedAt,
	}, nil
}

func (r *UserRepository) DeleteUser(ctx context.Context, id int64) error {
	return r.queries.DeleteUser(ctx, id)
}
