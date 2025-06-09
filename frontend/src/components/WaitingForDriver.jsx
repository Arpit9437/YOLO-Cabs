import { ChevronDown, MapPin, Banknote, AlertCircle, Car, Phone, MessageCircle, Star, Clock, Navigation } from "lucide-react"

const WaitingForDriver = ({ onClose, ride }) => {
  const getVehicleIcon = () => {
    switch (ride?.vehicleType) {
      case "moto":
        return (
          <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zm-.5 1.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/>
          </svg>
        )
      case "auto":
        return (
          <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L8 6v6h8V6l-4-4zm0 2.5L13.5 6h-3L12 4.5z"/>
          </svg>
        )
      default:
        return <Car size={40} className="text-yellow-600" />
    }
  }

  return (
    <div className="bg-white rounded-t-3xl shadow-2xl border-t-4 border-yellow-400">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <h2 className="text-2xl font-bold text-gray-800">Driver Assigned</h2>
        </div>
        <button 
          onClick={onClose} 
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronDown size={24} className="text-gray-400 hover:text-gray-600" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Driver & Vehicle Info */}
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-5 rounded-2xl border border-yellow-200">
          <div className="flex items-center gap-4">
            {/* Vehicle Icon */}
            <div className="w-20 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm">
              {getVehicleIcon()}
            </div>

            {/* Driver Details */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-gray-800 capitalize">
                  {ride?.captain?.fullname?.firstname || "Driver"} {ride?.captain?.fullname?.lastname || ""}
                </h3>
                <div className="flex items-center text-yellow-500">
                  <Star size={14} fill="currentColor" />
                  <span className="text-sm ml-1 text-gray-600">4.9</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mb-2">
                <div className="text-xl font-bold text-gray-800">
                  {ride?.captain?.vehicle?.plate || "XX XX XX XXXX"}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock size={14} className="mr-1" />
                  <span>Arriving in 3 mins</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">
                {ride?.captain?.vehicle?.vehicleType || "Maruti Suzuki Alto"} • {ride?.captain?.vehicle?.color || "White"}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                  <Phone size={16} />
                  <span>Call</span>
                </button>
                <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                  <MessageCircle size={16} />
                  <span>Chat</span>
                </button>
              </div>
            </div>

            {/* OTP Section */}
            <div className="text-center">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-yellow-200">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <AlertCircle size={18} className="text-yellow-600" />
                  <span className="text-sm font-medium text-gray-600">OTP</span>
                </div>
                <div className="text-3xl font-bold text-gray-800 tracking-wider">
                  {ride?.otp || "0000"}
                </div>
                <p className="text-xs text-gray-500 mt-1">Share with driver</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trip Details */}
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-4 h-4 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">Pickup</h3>
                <div className="flex items-center text-xs text-gray-500">
                  <Navigation size={12} className="mr-1" />
                  <span>Track driver</span>
                </div>
              </div>
              <p className="font-medium text-gray-800 leading-relaxed">{ride?.pickup}</p>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-px h-8 bg-gray-300"></div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-4 h-4 bg-red-500 rounded-full mt-1 flex-shrink-0"></div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Destination</h3>
              <p className="font-medium text-gray-800 leading-relaxed">{ride?.destination}</p>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Banknote size={20} className="text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">₹{ride?.fare}</h3>
                <p className="text-sm text-gray-600">Cash Payment</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 mb-1">Trip ID</div>
              <div className="text-sm font-mono text-gray-700">#{ride?._id?.slice(-6) || "123456"}</div>
            </div>
          </div>
        </div>

        {/* Safety Info */}
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle size={16} className="text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-1">Safety First</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Your trip is being tracked for safety. Share your OTP only with the assigned driver.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WaitingForDriver