package http

import (
	"bureau-backend/internal/core/domain"
	"encoding/json"
	"net/http"
)

func HealthCheck(w http.ResponseWriter, r *http.Request) {
	status := domain.HealthStatus{
		Status:  "success",
		Message: "Bureau Server is running",
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(status)
}
