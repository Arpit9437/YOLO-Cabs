import { X, MapPin, Car, Bike, Navigation, Clock, CreditCard } from "lucide-react"

const ConfirmRide = ({ onClose, onConfirmRide, pickup, destination, selectedVehicle, createRide }) => {
  const handleConfirmRide = async () => {
    console.log(selectedVehicle)
    try {
      await createRide(selectedVehicle.id)
      onConfirmRide()
    } catch (error) {
      console.error("Error creating ride:", error)
    }
  }

  const getVehicleIcon = (vehicleId) => {
    switch (vehicleId) {
      case "car":
        return <Car className="text-gray-700" size={32} />
      case "moto":
        return <Bike className="text-gray-700" size={32} />
      case "auto":
        return (
          <svg className="w-8 h-8 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L8 6v6h8V6l-4-4zm0 2.5L13.5 6h-3L12 4.5zM19 13h-2v2h2v-2zm-8 0H9v2h2v-2zm-6 0H3v2h2v-2zm14 4h-2v2h2v-2zm-8 0H9v2h2v-2zm-6 0H3v2h2v-2z"/>
          </svg>
        )
      default:
        return <Car className="text-gray-700" size={32} />
    }
  }

  return (
    <div className="bg-white rounded-t-3xl shadow-2xl border-t-4 border-yellow-400">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800">Confirm Your Ride</h3>
        <button 
          onClick={onClose} 
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={24} className="text-gray-400 hover:text-gray-600" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Vehicle Info Card */}
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-5 rounded-2xl border border-yellow-200">
          <div className="flex items-center gap-4">
            <div className="w-20 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm">
              {getVehicleIcon(selectedVehicle.id)}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-lg text-gray-800">{selectedVehicle.name}</h4>
              <p className="text-sm text-gray-600">{selectedVehicle.description}</p>
              <div className="flex items-center mt-2 space-x-4">
                <div className="flex items-center text-xs text-gray-500">
                  <Clock size={14} className="mr-1" />
                  <span>2-3 mins away</span>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Navigation size={14} className="mr-1" />
                  <span>Track live</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-800">₹{selectedVehicle.price}</div>
              <div className="text-xs text-gray-500">Total fare</div>
            </div>
          </div>
        </div>

        {/* Trip Details */}
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-4 h-4 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500 mb-1">PICKUP</p>
              <p className="font-medium text-gray-800 leading-relaxed">{pickup}</p>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-px h-8 bg-gray-300"></div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-4 h-4 bg-red-500 rounded-full mt-1 flex-shrink-0"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500 mb-1">DESTINATION</p>
              <p className="font-medium text-gray-800 leading-relaxed">{destination}</p>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CreditCard size={20} className="text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-800">Cash Payment</p>
              <p className="text-sm text-gray-500">Pay directly to driver</p>
            </div>
          </div>
          <button className="text-yellow-600 font-medium text-sm hover:text-yellow-700">
            Change
          </button>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirmRide}
          className="w-full bg-gradient-to-r from-yellow-400 to-amber-400 text-gray-800 py-4 rounded-xl font-bold text-lg hover:from-yellow-500 hover:to-amber-500 transition-all duration-200 shadow-lg transform hover:scale-[1.02]"
        >
          Confirm Ride - ₹{selectedVehicle.price}
        </button>

        {/* Additional Info */}
        <p className="text-xs text-gray-500 text-center leading-relaxed">
          By confirming, you agree to our terms and conditions. Your ride will be tracked for safety.
        </p>
      </div>
    </div>
  )
}

export default ConfirmRide