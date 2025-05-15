export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow animate-pulse overflow-hidden">
      <div className="aspect-[3/4] bg-gray-200" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="flex gap-2 mt-2">
          <div className="h-4 w-10 bg-gray-200 rounded" />
          <div className="h-4 w-12 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  )
}
