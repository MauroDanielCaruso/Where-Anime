package scraper

import (
	"encoding/json"
	"fmt"
	"regexp"
	"strconv"
	"strings"

	"github.com/gocolly/colly"
)

type AnimeResult struct {
	Title string `json:"title"`
	URL   string `json:"url"`
	Image string `json:"image"`
}

type Episode struct {
	EpisodeNumber int    `json:"episode"`
	WatchURL      string `json:"watch_url"`
}

type ServerOption struct {
	Lang        string `json:"lang"` // SUB o LAT
	Server      string `json:"server"`
	Title       string `json:"title"`
	URL         string `json:"url,omitempty"`
	EmbedCode   string `json:"code,omitempty"`
	AllowMobile bool   `json:"allow_mobile"`
	Ads         bool   `json:"ads"`
}

func SearchAnimeFLV(query string) ([]AnimeResult, error) {
	var results []AnimeResult
	c := colly.NewCollector()

	c.OnHTML("article.Anime", func(e *colly.HTMLElement) {
		title := e.ChildText("h3.Title")
		link := e.ChildAttr("a", "href")
		image := e.ChildAttr("img", "src")

		results = append(results, AnimeResult{
			Title: title,
			URL:   "https://www3.animeflv.net" + link,
			Image: image,
		})
	})

	searchQuery := strings.ReplaceAll(query, " ", "+")
	searchURL := fmt.Sprintf("https://www3.animeflv.net/browse?q=%s", searchQuery)

	err := c.Visit(searchURL)
	return results, err
}

func GetEpisodes(animeSlug string) ([]Episode, error) {
	url := fmt.Sprintf("https://www3.animeflv.net/anime/%s", animeSlug)
	c := colly.NewCollector()
	var episodes []Episode

	c.OnHTML("script", func(e *colly.HTMLElement) {
		if strings.Contains(e.Text, "var episodes =") {
			re := regexp.MustCompile(`var episodes\s*=\s*(\[\[.*?\]\]);`)
			match := re.FindStringSubmatch(e.Text)
			if len(match) > 1 {
				rawArray := match[1]
				items := regexp.MustCompile(`\[(\d+),(\d+)\]`).FindAllStringSubmatch(rawArray, -1)
				for _, item := range items {
					epNum, _ := strconv.Atoi(item[1])
					episodes = append(episodes, Episode{
						EpisodeNumber: epNum,
						WatchURL:      fmt.Sprintf("https://www3.animeflv.net/ver/%s-%d", animeSlug, epNum),
					})
				}
			}
		}
	})

	err := c.Visit(url)
	return episodes, err
}

func GetEpisodeServers(episodeSlug string) ([]ServerOption, error) {
	url := fmt.Sprintf("https://www3.animeflv.net/ver/%s", episodeSlug)
	c := colly.NewCollector()
	var servers []ServerOption

	c.OnHTML("script", func(e *colly.HTMLElement) {
		if strings.Contains(e.Text, "var videos =") {
			re := regexp.MustCompile(`var videos\s*=\s*({.*?});`)
			match := re.FindStringSubmatch(e.Text)
			if len(match) > 1 {
				jsonStr := match[1]
				jsonStr = strings.ReplaceAll(jsonStr, `\/`, `/`) // des-escapea urls

				var raw map[string][]map[string]interface{}
				if err := json.Unmarshal([]byte(jsonStr), &raw); err != nil {
					fmt.Println("ERROR DECODING:", err)
					return
				}

				for lang, sources := range raw {
					for _, s := range sources {
						option := ServerOption{
							Lang:        lang,
							Server:      s["server"].(string),
							Title:       s["title"].(string),
							AllowMobile: s["allow_mobile"].(bool),
							Ads:         int(s["ads"].(float64)) == 1,
						}
						if url, ok := s["url"].(string); ok {
							option.URL = url
						}
						if code, ok := s["code"].(string); ok {
							option.EmbedCode = code
						}
						servers = append(servers, option)
					}
				}
			}
		}
	})

	err := c.Visit(url)
	return servers, err
}
