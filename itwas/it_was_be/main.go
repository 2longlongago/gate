package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
)

const (
	passwordFile = "files/password.txt"
	serverPort   = "12126"
)

func accessControl(w http.ResponseWriter, r *http.Request) bool {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

	return r.Method != "OPTIONS"
}

func writeStatus(code string, w http.ResponseWriter) {
	w.Write([]byte(code))
}

func handleData(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		password := r.FormValue("password")

		if len(password) == 0 {
			if success, _ := passwordCheck(r); success {
				responseWrite(w)
			} else {
				w.Write([]byte("404"))
			}

			return
		}

		// if r.Method == "POST" {
		// password := r.FormValue("password")
		realPassword := string(readPassword())

		if password == realPassword {
			buf, err := openDataFile(w, r)

			if err != nil {
				writeStatus("404", w)
				return
			}

			filename := "files/data.json"
			err = writeDataFile(filename, buf)
			if err != nil {
				writeStatus("404", w)
				return
			}
			writeStatus("200", w)

		} else {
			writeStatus("404", w)
		}
		// }
	}
}

func handlePassword(w http.ResponseWriter, r *http.Request) {
	if success, content := passwordCheck(r); success {

		writePasswordFile(w, content)
	} else {
		writeStatus("404", w)
	}
}

func passwordCheck(r *http.Request) (bool, string) {
	bad := "bad"

	if r.Method == "POST" {
		var body map[string]string

		err := json.NewDecoder(r.Body).Decode(&body)

		if err != nil {
			fmt.Println("json decode(body) error: ", err)
			return false, bad
		}

		login := body["password"]
		content := body["content"]

		realPassword := string(readPassword())

		if login != realPassword {
			return false, bad
		}

		return true, content
	}

	return false, bad
}

func readPassword() []byte {
	content, err := ioutil.ReadFile(passwordFile)
	if err != nil {
		log.Println("read password err: ", err)
	}
	return content
}

func responseWrite(w http.ResponseWriter) {
	// fmt.Println("write")

	filename := "files/data.json"

	file, err := ioutil.ReadFile(filename)

	if len(file) == 0 {
		return
	}

	if err != nil {
		fmt.Println(err)
		return
	}

	w.Write(file)
}

func openDataFile(w http.ResponseWriter, r *http.Request) (bytes.Buffer, error) {

	fileHeader := r.MultipartForm.File["datafile"][0]

	fff, err := fileHeader.Open()

	var buf bytes.Buffer
	io.Copy(&buf, fff)

	if err != nil {
		print("Open file error %s", err)
		return buf, err
	}

	return buf, nil
}

func writeDataFile(filename string, file bytes.Buffer) error {
	f, err := os.OpenFile(filename, os.O_RDWR|os.O_CREATE|os.O_TRUNC, 0755)
	if err != nil {
		log.Println(err)
		return err
	}
	defer f.Close()
	if _, err := f.Write(file.Bytes()); err != nil {
		log.Fatal(err)
		return err
	}

	return nil
}

func writePasswordFile(w http.ResponseWriter, content string) {
	filename := "files/password.txt"

	err := ioutil.WriteFile(filename, []byte(content), 0644)
	if err != nil {
		log.Printf("write %s err: %s", filename, err)
		writeStatus("404", w)
	} else {
		writeStatus("200", w)
	}
}

func makeHandler(fn func(http.ResponseWriter, *http.Request)) http.HandlerFunc {

	return func(w http.ResponseWriter, r *http.Request) {
		if a := accessControl(w, r); !a {
			return
		}

		fn(w, r)
	}
}

func main() {

	http.HandleFunc("/data", makeHandler(handleData))
	http.HandleFunc("/password", makeHandler(handlePassword))

	port := os.Getenv("PORT")
	if port == "" {
		port = serverPort
	}

	log.Printf("Listening on port %s", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatal(err)
	}
}

// func handleDataGet(w http.ResponseWriter, r *http.Request) {
// 	if success, _ := passwordCheck(r); success {
// 		responseWrite(w)
// 	} else {
// 		w.Write([]byte("404"))
// 	}
// }
// func handleDataFile(w http.ResponseWriter, r *http.Request, filename string) {
// 	password := r.FormValue("password")
// 	realPassword := string(readPassword())
// 	if password == realPassword {
// 		buf, err := openDataFile(w, r)
// 		if err != nil {
// 			writeStatus("404", w)
// 			return
// 		}
// 		fname := "files/" + filename
// 		err = writeDataFile(fname, buf)
// 		if err != nil {
// 			writeStatus("404", w)
// 			return
// 		}
// 		writeStatus("200", w)
// 	} else {
// 		writeStatus("404", w)
// 	}
// }
// func handlePasswordFile(w http.ResponseWriter, r *http.Request, filename string) {
// 	if success, content := passwordCheck(r); success {
// 		writeFile(w, filename, content)
// 	} else {
// 		writeStatus("404", w)
// 	}
// }
// func makeHandleWriter(fn func(http.ResponseWriter, *http.Request, string), filename string) http.HandlerFunc {
// 	return func(w http.ResponseWriter, r *http.Request) {
// 		if a := accessControl(w, r); !a {
// 			return
// 		}
// 		fn(w, r, filename)
// 	}
// }
// http.HandleFunc("/dataget", makeHandler(handleDataGet))
// http.HandleFunc("/datarewrite", makeHandleWriter(handleDataFile, "data.json"))
// http.HandleFunc("/passwordreset", makeHandleWriter(handlePasswordFile, "password.txt"))
