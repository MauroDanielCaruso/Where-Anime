import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSearchParams, useNavigate } from 'react-router-dom'

export default function SearchResults() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const query = searchParams.get('q') || ''
    const [results, setResults] = useState<any[]>([])
    const [suggestion, setSuggestion] = useState<string | null>(null)
    const [input, setInput] = useState(query)

    useEffect(() => {
        if (query) {
            axios.get(`http://localhost:8080/search?q=${query}`).then(res => {
                const flv = res.data.animeflv || []
                setResults(flv)
                if (flv.length === 0 && res.data.jikan?.data?.length > 0) {
                    setSuggestion(res.data.jikan.data[0].title)
                } else {
                    setSuggestion(null)
                }
            })
        }
    }, [query])

    const handleSearch = () => {
        if (input.trim()) {
            navigate(`/resultados?q=${input.trim()}`)
        }
    }

    return (
        <div className="bg-amber-50 min-h-screen text-gray-900">
            {/* Navbar */}
            <header className="flex justify-between items-center px-8 py-6">
 <h1 className="text-3xl font-bold">
    <span className="text-black">Where</span>
    <span className="text-orange-500">Anime</span>
  </h1>
                {/* Contenedor del buscador (centrado) */}
  <div className="absolute left-1/2 transform -translate-x-1/2 w-[600px]"> {/* Ajusta el ancho aquí */}
                    <div className="flex gap-2 w-full max-w-md">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Buscar anime..."
                            className="flex-1 px-3 py-1.5 rounded border"
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button
                            onClick={handleSearch}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-4 rounded"
                        >
                            Buscar
                        </button>
                    </div>
                </div>
            </header>

            <main className="px-4 sm:px-6 py-10 max-w-7xl mx-auto">
                {results.length === 0 ? (
                    <div className="text-center text-gray-600 mt-10">
                        <h2 className="text-xl font-semibold mb-2">No se encontraron resultados</h2>
                        {suggestion && (
                            <p>
                                ¿Quisiste decir{' '}
                                <span
                                    className="text-orange-600 cursor-pointer underline"
                                    onClick={() => navigate(`/resultados?q=${suggestion}`)}
                                >
                                    {suggestion}
                                </span>
                                ?
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {results.map(anime => {
                            const animeSlug = anime.url.replace('https://www3.animeflv.net/anime/', '')
                            return (
                                <div
                                    key={anime.url}
                                    className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow"
                                >
                                    <div
                                        className="aspect-[3/4] bg-gray-100 cursor-pointer overflow-hidden"
                                        onClick={() => navigate(`/anime/${animeSlug}`)}
                                    >
                                        <img
                                            src={anime.image}
                                            alt={anime.title}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                                        />
                                    </div>
                                    <div className="p-3 flex flex-col gap-2">
                                        <h3 className="text-sm font-semibold truncate">
                                            {anime.title}
                                        </h3>

                                        <div className="flex flex-wrap gap-1 text-xs">
                                            <a className="px-2 py-0.5 bg-gray-200 rounded" href={anime.url}
                                                target="_blank"
                                                rel="noreferrer">AnimeFLV</a>
                                            <span className="px-2 py-0.5 bg-gray-200 rounded">Crunchyroll</span>
                                            <span className="px-2 py-0.5 bg-gray-200 rounded">Netflix</span>
                                        </div>
                                    </div>

                                </div>
                            )
                        })}
                    </div>
                )}
            </main>
        </div>
    )
}
