import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import clsx from 'clsx'
import { AiOutlineWarning } from 'react-icons/ai'

type Server = {
  title: string
  lang: string
  url?: string
  code?: string
  server: string
}

export default function EpisodePage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [servers, setServers] = useState<Server[]>([])
  const [selected, setSelected] = useState(0)

  const [animeSlug, setAnimeSlug] = useState('')
  const [episodeNumber, setEpisodeNumber] = useState<number | null>(null)

  useEffect(() => {
    if (slug) {
      const parts = slug.split('-')
      const epNumStr = parts.pop()
      const epNum = Number(epNumStr)
      const anime = parts.join('-')
      setAnimeSlug(anime)
      setEpisodeNumber(epNum)

      axios
        .get(`http://localhost:8080/episode/${slug}/servers`)
        .then((res) => setServers(res.data || []))
    }
  }, [slug])

  const selectedServer = servers[selected]

  const goToEpisode = (epNum: number) => {
    navigate(`/ver/${animeSlug}-${epNum}`)
  }

  return (
    <div className="bg-gray-50 min-h-screen px-6 py-10 text-gray-900">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Encabezado */}
        <header className="space-y-1">
          <p className="text-sm text-gray-500">
            Información del anime · <a href="/" className="underline">Volver al inicio</a>
          </p>
          <h1 className="text-xl sm:text-2xl font-bold">
            <span className="text-orange-600">{animeSlug.replaceAll('-', ' ')}</span> — Episodio {episodeNumber}
          </h1>
        </header>

        {/* Player o mensaje */}
        <div className="bg-white shadow rounded-lg p-4">
          <div className="aspect-video w-full bg-black rounded overflow-hidden">
            {selectedServer ? (
              selectedServer.code ? (
                <iframe
                  src={selectedServer.code}
                  className="w-full h-full border-0"
                  allowFullScreen
                />
              ) : selectedServer.url ? (
                <div className="h-full flex flex-col items-center justify-center text-white p-4">
                  <p>Este enlace no es embebible.</p>
                  <a
                    href={selectedServer.url}
                    className="underline text-orange-400 mt-2"
                    target="_blank"
                  >
                    Ver en servidor externo
                  </a>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-white">
                  El archivo ya no es accesible
                </div>
              )
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-orange-600 bg-gray-100 text-center">
                <AiOutlineWarning size={40} className="mb-2" />
                <p className="text-sm font-semibold">El archivo ya no es accesible</p>
                <p className="text-xs text-gray-600">Intentá con otro servidor o reportá este problema</p>
                <button className="mt-3 px-4 py-1 bg-orange-500 text-white rounded hover:bg-orange-600">
                  Reportar problema
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Servidores disponibles */}
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Servidores disponibles:</p>
          <div className="flex flex-wrap gap-2">
            {servers.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setSelected(idx)}
                className={clsx(
                  'px-4 py-1 text-sm rounded border',
                  selected === idx
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white hover:bg-gray-100 border-gray-300 text-gray-800'
                )}
              >
                Opción {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Navegación episodio */}
        <div className="flex justify-between">
          {episodeNumber && episodeNumber > 1 ? (
            <button
              onClick={() => goToEpisode(episodeNumber - 1)}
              className="text-sm px-3 py-1 border rounded hover:bg-gray-100"
            >
              ◀ Anterior
            </button>
          ) : <span />}
          <button
            onClick={() => goToEpisode((episodeNumber ?? 0) + 1)}
            className="text-sm px-3 py-1 border rounded hover:bg-gray-100"
          >
            Siguiente ▶
          </button>
        </div>

        {/* Footer episodio */}
        <footer className="text-sm text-gray-600 border-t pt-4 mt-6 flex justify-between">
          <a
            href={`https://www3.animeflv.net/ver/${slug}`}
            className="hover:text-orange-500"
            target="_blank"
          >
            Ver en AnimeFLV ↗
          </a>
          <a
            href={`/anime/${animeSlug}`}
            className="text-orange-500 font-medium hover:underline"
          >
            Ver todos los episodios →
          </a>
        </footer>
      </div>
    </div>
  )
}
