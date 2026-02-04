package http

import (
	"bureau-backend/internal/core/ports"
	"encoding/json"
	"net/http"
)

type DashboardHandler struct {
	userRepo ports.UserRepository
}

func NewDashboardHandler(userRepo ports.UserRepository) *DashboardHandler {
	return &DashboardHandler{
		userRepo: userRepo,
	}
}

type StatsResponse struct {
	TotalUsers int64 `json:"total_users"`
}

// GetStats returns dashboard statistics
// @Summary Get dashboard statistics
// @Description Get dashboard statistics including total users
// @Tags dashboard
// @Produce json
// @Success 200 {object} StatsResponse
// @Router /api/v1/dashboard/stats [get]
func (h *DashboardHandler) GetStats(w http.ResponseWriter, r *http.Request) {
	count, err := h.userRepo.Count(r.Context())
	if err != nil {
		http.Error(w, "Failed to fetch stats", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(StatsResponse{
		TotalUsers: count,
	})
}
