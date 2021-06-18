package main

import (
	"encoding/json"
	"net/http"
)

// Send write response
func Send(w http.ResponseWriter, sending *string, describe string) {
	err := json.NewEncoder(w).Encode(sending)
	des := describe
	if describe == "" {
		des = ""
	}

	if err != nil {
		w.Write([]byte(err.Error() + des))
		panic(des)
	}
}
