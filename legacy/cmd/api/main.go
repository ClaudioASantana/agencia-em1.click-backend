package main

import (
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
	httpSwagger "github.com/swaggo/http-swagger"

	_ "bureau-backend/docs" // Import generated docs
	handler "bureau-backend/internal/adapters/handler/http"
	"bureau-backend/internal/adapters/repository"
	"bureau-backend/internal/core/services"
)

// @title Bureau Backend API
// @version 1.0
// @description This is the backend API for Bureau
// @host localhost:8082
// @BasePath /api/v1
func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// Database Connection
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("DATABASE_URL environment variable is not set")
	}

	pool, err := repository.NewPostgresConnection(dbURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer pool.Close()
	log.Println("Connected to PostgreSQL database successfully")

	r := chi.NewRouter()

	// Middlewares
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	// Basic CORS
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// --- Dependency Injection ---
	// User / Auth
	userRepo := repository.NewUserRepository(pool)
	authService := services.NewAuthService(userRepo)
	authHandler := handler.NewAuthHandler(authService)
	dashboardHandler := handler.NewDashboardHandler(userRepo)
	userService := services.NewUserService(userRepo)
	userHandler := handler.NewUserHandler(userService)

	// --- Routes ---
	r.Get("/health", handler.HealthCheck)
	r.Get("/swagger/*", httpSwagger.WrapHandler)

	r.Route("/api/v1/auth", func(r chi.Router) {
		r.Post("/register", authHandler.Register)
		r.Post("/login", authHandler.Login)
	})

	r.Route("/api/v1/dashboard", func(r chi.Router) {
		r.Use(handler.JWTMiddleware)
		r.Get("/stats", dashboardHandler.GetStats)
	})

	r.Route("/api/v1/users", func(r chi.Router) {
		r.Use(handler.JWTMiddleware)
		r.Post("/", userHandler.CreateUser)
		r.Get("/", userHandler.ListUsers)
		r.Get("/{id}", userHandler.GetUser)
		r.Put("/{id}", userHandler.UpdateUser)
		r.Delete("/{id}", userHandler.DeleteUser)
	})

	// Start Server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Starting server on :%s", port)
	if err := http.ListenAndServe(":"+port, r); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
