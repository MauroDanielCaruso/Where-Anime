import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'
import { Link } from "react-router-dom"

const genres = ['Acción', 'Romance', 'Fantasía', 'Comedia', 'Drama', 'Sci-Fi']

export default function Home() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/resultados?q=${query.trim()}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white text-gray-900 flex flex-col">
      <header className="flex justify-between items-center px-4 py-6">
        <Link href="/"> {/* o `to="/"` si es React Router */}
          <h1 className="text-3xl font-bold cursor-pointer hover:opacity-80 transition-opacity">
            <span className="text-black">Where</span>
            <span className="text-orange-500">Anime</span>
          </h1>
        </Link>
        <nav className="flex gap-6 text-sm font-semibold">
          {/* <a href="#" className="hover:text-orange-500">Explorar</a>
          <a href="#" className="hover:text-orange-500">Top Animes</a>
          <a href="#" className="hover:text-orange-500">Iniciar Sesión</a> */}
        </nav>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                <h1 className="text-5xl sm:text-6xl font-extrabold mb-4">
          <span className="text-black">Where</span>
          <span className="text-orange-500">Anime</span>
        </h1>
        <p className="text-lg text-gray-600 mb-6">Encuentra tu próximo anime favorito</p>

        {/* Buscador centrado */}
        <div className="flex items-center bg-white shadow-lg rounded-full overflow-hidden w-full max-w-2xl mb-4">
          <div className="px-4 text-gray-500"><FaSearch /></div>
          <input
            type="text"
            placeholder="Busca por título, género o estudio..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 py-3 px-2 text-gray-800 focus:outline-none"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="bg-orange-500 text-white px-6 py-3 font-semibold hover:bg-orange-600 transition-colors duration-200"
          >
            Buscar
          </button>
        </div>

        {/* Géneros sugeridos */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {genres.map(g => (
            <button
              key={g}
              className="px-4 py-1 rounded-full border border-gray-300 hover:bg-orange-100 text-sm"
              onClick={() => {
                setQuery(g)
                navigate(`/resultados?q=${g}`)
              }}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Sugerencia aleatoria */}
        <p className="text-sm text-gray-600">
          ¿No sabés qué buscar?{' '}
          <a href="#" className="text-orange-600 font-medium hover:underline">
            Sugerir un anime aleatorio
          </a>
        </p>
      </main>

      {/* Footer */}
      <footer className="text-sm text-gray-500 text-center py-6 mt-auto border-t">
        <p>© 2025 WhereAnime</p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="#" className="hover:text-orange-500">Acerca de</a>
          <a href="#" className="hover:text-orange-500">Privacidad</a>
          <a href="#" className="hover:text-orange-500">Términos</a>
          <a href="#" className="hover:text-orange-500">Contacto</a>
        </div>
      </footer>
    </div>
  )
}
