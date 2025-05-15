package provider

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type JikanAnime struct {
	Data []struct {
		Title  string `json:"title"`
		MalID  int    `json:"mal_id"`
		Images struct {
			JPG struct {
				ImageURL string `json:"image_url"`
			} `json:"jpg"`
		} `json:"images"`
		Synopsis string `json:"synopsis"`
	} `json:"data"`
}

func SearchJikan(query string) (*JikanAnime, error) {
	url := fmt.Sprintf("https://api.jikan.moe/v4/anime?q=%s", query)
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var anime JikanAnime
	err = json.NewDecoder(resp.Body).Decode(&anime)
	return &anime, err
}
