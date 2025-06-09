import { MapPin, Clock, Star } from 'lucide-react'

const LocationSearchPanel = ({ suggestions, onLocationSelect, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 mt-2 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-yellow-200 border-t-yellow-400 rounded-full animate-spin"></div>
            <span className="text-sm font-medium text-gray-600">Searching locations...</span>
          </div>
        </div>
        <div className="space-y-0">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 animate-pulse border-b border-gray-50 last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!suggestions?.predictions || suggestions.status !== 'OK') {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 mt-2 p-6 text-center">
        <MapPin size={32} className="text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">No locations found</p>
        <p className="text-sm text-gray-400 mt-1">Try searching with a different keyword</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 mt-2 overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-yellow-50 to-amber-50">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-yellow-600" />
          <span className="text-sm font-medium text-gray-700">
            {suggestions.predictions.length} location{suggestions.predictions.length !== 1 ? 's' : ''} found
          </span>
        </div>
      </div>
      
      <div className="max-h-80 overflow-y-auto">
        {suggestions.predictions.map((location, index) => (
          <button
            key={location.place_id}
            onClick={() => onLocationSelect(location)}
            className="w-full text-left p-4 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-amber-50 flex items-center gap-4 transition-all border-b border-gray-50 last:border-b-0 group"
          >
            <div className="w-10 h-10 bg-gray-100 group-hover:bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 transition-colors">
              {index < 3 ? (
                <Star size={16} className="text-yellow-500" fill="currentColor" />
              ) : (
                <MapPin size={16} className="text-gray-500 group-hover:text-yellow-600 transition-colors" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 line-clamp-1 group-hover:text-gray-900">
                {location.structured_formatting.main_text}
              </p>
              <p className="text-sm text-gray-500 line-clamp-1 mt-1 group-hover:text-gray-600">
                {location.structured_formatting.secondary_text}
              </p>
            </div>

            {index < 3 && (
              <div className="flex items-center gap-1 text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                <Clock size={12} />
                <span>Recent</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export default LocationSearchPanel
