import { Loader2, X, User, MapPin, DollarSign } from 'lucide-react'

const LookingForDriver = ({ pickup, destination, selectedVehicle, setActivePanel }) => {
  return (
    <div className="bg-white rounded-t-3xl shadow-2xl border-t-4 border-yellow-400 animate-slideUp">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
          <h2 className="text-2xl font-bold text-gray-800">Finding Your Captain</h2>
        </div>
        <button
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          onClick={() => setActivePanel("confirm")}
        >
          <X size={24} className="text-gray-400 hover:text-gray-600" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Loading Animation */}
        <div className="text-center py-8">
          <div className="relative mb-6">
            <div className="w-32 h-32 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-full flex items-center justify-center mx-auto border-4 border-yellow-200">
              <User size={48} className="text-yellow-600" />
            </div>
            <div className="absolute inset-0 w-32 h-32 mx-auto">
              <Loader2 className="w-full h-full animate-spin text-yellow-400 opacity-30" />
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <Loader2 className="animate-spin text-yellow-500" size={20} />
            <p className="text-gray-600 font-medium">Connecting you with nearby captains...</p>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-sm text-gray-600">
              We're finding the best captain for your ride. This usually takes 30-60 seconds.
            </p>
          </div>
        </div>

        {/* Trip Details Card */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 space-y-4">
          {/* Pickup Location */}
          <div className="flex items-start gap-4">
            <div className="w-4 h-4 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Pickup</p>
              <p className="font-medium text-gray-800 leading-relaxed">{pickup}</p>
            </div>
          </div>

          {/* Connecting Line */}
          <div className="flex items-center justify-center">
            <div className="w-px h-8 bg-gray-300"></div>
          </div>

          {/* Destination */}
          <div className="flex items-start gap-4">
            <div className="w-4 h-4 bg-red-500 rounded-full mt-1 flex-shrink-0"></div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Destination</p>
              <p className="font-medium text-gray-800 leading-relaxed">{destination}</p>
            </div>
          </div>

          {/* Vehicle & Fare Info */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <DollarSign size={20} className="text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{selectedVehicle?.name || "Selected Vehicle"}</p>
                  <p className="text-sm text-gray-500">Estimated fare</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800">₹{selectedVehicle?.price || "0"}</div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>

        {/* Cancel Button */}
        <button
          onClick={() => setActivePanel("confirm")}
          className="w-full border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-medium hover:border-gray-400 hover:bg-gray-50 transition-all"
        >
          Cancel Search
        </button>
      </div>
    </div>
  )
}

export default LookingForDriver
