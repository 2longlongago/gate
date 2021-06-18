package main

import (
	"math"
	// "it_was_be/globaldefine"
	"testing"
)

func TestLogIncoming(t *testing.T) {}

func TestTemplateHandler(t *testing.T) {
	// var (
	// 	r *http.Request
	// 	// w http.ResponseWriter
	// )

	// r.Method = "GET"
	// globaldefine.TemplateTV = true

	// // templateHandler(w, r)

	// if globaldefine.TemplateTV == false {
	// 	t.Log("globaldefine.TemplateTV reverse to false")
	// }

	// if globaldefine.TemplateTV == true {
	// 	t.Log("globaldefine.TemplateTV reverse to true")
	// }
}

func TestAbs(t *testing.T) {
	got := math.Abs(-1)
	if got != 1 {
		t.Errorf("Abs(-1) = %f; want 1", got)
	}
}
