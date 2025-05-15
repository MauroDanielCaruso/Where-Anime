import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

type Episode = {
  episode: number
  watch_url: string
}

export default function AnimePage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [episodes, setEpisodes] = useState<Episode[]>([])

  useEffect(() => {
    if (slug) {
      axios
        .get(`http://localhost:8080/anime/${slug}/episodes`)
        .then((res) => {
          const sorted = res.data.sort((a: Episode, b: Episode) => a.episode - b.episode)
          setEpisodes(sorted)
        })
    }
  }, [slug])

  const goToEpisode = (epNum: number) => {
    navigate(`/ver/${slug}-${epNum}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white text-gray-900 p-6">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-3xl font-bold capitalize mb-2">{slug?.replaceAll("-", " ")}</h1>
        <p className="text-gray-600 mb-6">Seleccioná un episodio para ver</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {episodes.map((ep, idx) => {
            const prevEp = episodes[idx - 1]
            const nextEp = episodes[idx + 1]
            return (
              <div key={ep.episode} className="bg-white rounded shadow p-3 flex flex-col items-center">
                <img
                  src={`https://fakeimg.pl/320x180?text=Ep+${ep.episode}`}
                  alt={`Episodio ${ep.episode}`}
                  className="rounded mb-2 cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => goToEpisode(ep.episode)}
                />
                <h3 className="font-semibold text-sm mb-1">Episodio {ep.episode}</h3>

                <a
                  href={ep.watch_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-orange-600"
                >
                  <img src="https://www3.animeflv.net/favicon.ico" className="w-4 h-4" />
                  Ver en AnimeFLV
                </a>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
