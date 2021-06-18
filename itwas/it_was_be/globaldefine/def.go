package globaldefine

// TemplateTV change TV template
var TemplateTV bool = true

const (
	// Port pointed a port, used in listening and database address
	Port string = "12126"
	// Address a url
	// Address string = "localhost"
	Address string = "https://sayagoBe.appspot.com"
	// Address string = "http://192.168.8.35"

	// Space separate two
	Space string = " "
	// HorizontalLine link two
	HorizontalLine string = "-"
	// Conlon following
	Conlon string = ":"
)

// SendStatus are you OK?
type SendStatus struct {
	Status int    `json:"status"`
	Text   string `json:"text"`
}
