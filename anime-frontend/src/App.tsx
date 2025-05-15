import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AnimePage from './pages/Animes'
import EpisodePage from './pages/Episode'
import SearchResults from './pages/SearchResults'


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/resultados" element={<SearchResults />} />
      <Route path="/anime/:slug" element={<AnimePage />} />
      <Route path="/ver/:slug" element={<EpisodePage />} />
    </Routes>
  )
}
