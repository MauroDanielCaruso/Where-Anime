type Props = {
  title: string
  image: string
  synopsis?: string
  sources: Record<string, { url: string }>
}

export default function AnimeCard({ title, image, synopsis, sources }: Props) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col">
      <img src={image} alt={title} className="aspect-[3/4] object-cover w-full" />
      <div className="p-3 flex flex-col gap-2 flex-1">
        <h3 className="text-sm font-semibold">{title}</h3>
        {synopsis && (
          <p className="text-xs text-gray-600 line-clamp-3">{synopsis}</p>
        )}
        <div className="flex gap-2 mt-auto">
          {sources.animeflv && (
            <a
              href={sources.animeflv.url}
              target="_blank"
              rel="noreferrer"
              title="Ver en AnimeFLV"
            >
              <img
                src="https://www3.animeflv.net/favicon.ico"
                className="w-5 h-5"
              />
            </a>
          )}
          {sources.jkanime && (
            <a
              href={sources.jkanime.url}
              target="_blank"
              rel="noreferrer"
              title="Ver en JKAnime"
            >
              <img
                src="https://jkanime.net/favicon.ico"
                className="w-5 h-5"
              />
            </a>
          )}
          {/* Podés seguir agregando más */}
        </div>
      </div>
    </div>
  )
}
