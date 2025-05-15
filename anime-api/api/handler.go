package api

import (
	"anime-api/internal/infra/provider"
	"anime-api/internal/infra/scraper"
	"net/http"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine) {
	r.GET("/search", func(c *gin.Context) {
		query := c.Query("q")
		if query == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "query param 'q' is required"})
			return
		}

		flvResults, _ := scraper.SearchAnimeFLV(query)
		jikanResults, _ := provider.SearchJikan(query)

		c.JSON(http.StatusOK, gin.H{
			"animeflv": flvResults,
			"jikan":    jikanResults,
		})
	})
	r.GET("/anime/:slug/episodes", func(c *gin.Context) {
		slug := c.Param("slug")
		episodes, err := scraper.GetEpisodes(slug)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, episodes)
	})

	r.GET("/episode/:slug/servers", func(c *gin.Context) {
		slug := c.Param("slug")
		result, err := scraper.GetEpisodeServers(slug)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, result)
	})

}
