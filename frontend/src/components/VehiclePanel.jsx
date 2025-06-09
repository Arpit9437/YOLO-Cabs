import { X, Car, Clock, User, Bike, Zap, Shield, Star } from "lucide-react"
import { useState, useEffect } from "react"
import axios from "axios"

const VehiclePanel = ({
  onClose,
  onVehicleSelect,
  fare = {},
  isLoading = false,
  selectedVehicle,
  pickup,
  destination,
}) => {
  const [durations, setDurations] = useState({})
  const [selectedVehicleId, setSelectedVehicleId] = useState(null)

  const vehicles = [
    {
      id: "moto",
      name: "QuickBike",
      capacity: 1,
      description: "Fast & affordable bike rides",
      price: fare?.moto || 24,
      icon: Bike,
      iconUrl: "https://media.istockphoto.com/id/481436112/photo/illustration-of-transportation-sport-motorbike-racing-concept.jpg?s=2048x2048&w=is&k=20&c=nPtPar42lOw4eFFStZlioIrjxqjDfZ8PQGc3oZtL7zM=", 
      color: "from-blue-50 to-cyan-50",
      borderColor: "border-blue-200",
      iconColor: "text-blue-600",
      time: "2-4 mins",
      features: ["Fastest", "Eco-friendly"]
    },
    {
      id: "auto",
      name: "QuickAuto",
      capacity: 3,
      description: "Comfortable auto-rickshaw rides",
      price: fare?.auto || 35,
      icon: Car,
      iconUrl: "https://media.istockphoto.com/id/950577080/photo/the-autorickshaw-isolated.jpg?s=612x612&w=0&k=20&c=LEOTZ2wrQEmXicLuOwRPNNUqyYWOnOSGZO9r4J2TrLI=", 
      color: "from-green-50 to-emerald-50",
      borderColor: "border-green-200",
      iconColor: "text-green-600",
      time: "3-5 mins",
      features: ["Popular", "Air-conditioned"]
    },
    {
      id: "car",
      name: "QuickCar",
      capacity: 4,
      description: "Premium comfort car rides",
      price: fare?.car || 58,
      icon: Car,
      iconUrl: "https://media.istockphoto.com/id/1070147706/photo/3d-illustration-of-generic-silver-hatchback-on-white-background.jpg?s=2048x2048&w=is&k=20&c=Evd9AoL5WQMxNCb1sRx2vQnW5v3Ki_M8GPQ05H7FNA4=", 
      color: "from-yellow-50 to-amber-50",
      borderColor: "border-yellow-200",
      iconColor: "text-yellow-600",
      time: "4-6 mins",
      features: ["Comfortable", "Spacious"]
    },
  ]

  const handleVehicleSelection = async (vehicle) => {
    try {
      setSelectedVehicleId(vehicle.id)
      selectedVehicle(vehicle)
      onVehicleSelect(vehicle)
    } catch (error) {
      console.error("Error creating ride:", error)
    }
  }

  useEffect(() => {
    const fetchDurations = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/maps/get-distance-time`, {
          params: { origin: pickup, destination: destination },
          headers: { Authorization: `Bearer ${token}` },
        })
        setDurations(response.data)
      } catch (error) {
        console.error("Error fetching durations:", error)
      }
    }

    if (pickup && destination) {
      fetchDurations()
    }
  }, [pickup, destination])

  const getAutoIcon = () => (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2L8 6v6h8V6l-4-4zm0 2.5L13.5 6h-3L12 4.5zM19 13h-2v2h2v-2zm-8 0H9v2h2v-2zm-6 0H3v2h2v-2zm14 4h-2v2h2v-2zm-8 0H9v2h2v-2zm-6 0H3v2h2v-2z"/>
    </svg>
  )

  return (
    <div className="bg-white rounded-t-3xl shadow-2xl border-t-4 border-yellow-400 max-h-[80vh] overflow-hidden">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Choose Your Ride</h3>
            {durations.duration && (
              <div className="flex items-center text-gray-600 mt-1">
                <Clock size={16} className="mr-2" />
                <span className="text-sm font-medium">{durations.duration.text} trip</span>
                {durations.distance && (
                  <span className="text-sm text-gray-500 ml-2">• {durations.distance.text}</span>
                )}
              </div>
            )}
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-400 hover:text-gray-600" />
          </button>
        </div>
      </div>

      {/* Vehicle Options */}
      <div className="p-6 space-y-4 overflow-y-auto max-h-96">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-yellow-200 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 font-medium">Finding the best prices...</p>
          </div>
        ) : (
          vehicles.map((vehicle) => {
            const VehicleIcon = vehicle.icon
            const isSelected = selectedVehicleId === vehicle.id
            
            return (
              <button
                key={vehicle.id}
                onClick={() => handleVehicleSelection(vehicle)}
                className={`w-full p-5 rounded-2xl border-2 transition-all duration-200 hover:shadow-lg ${
                  isSelected 
                    ? `${vehicle.borderColor} bg-gradient-to-r ${vehicle.color} border-opacity-100 shadow-md` 
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Vehicle Icon */}
                  <div className={`w-20 h-16 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-white shadow-sm' : 'bg-gray-50'
                  }`}>
                    {vehicle.iconUrl ? (
                      <img
                        src={vehicle.iconUrl}
                        alt={vehicle.name}
                        className="w-10 h-10 object-contain"
                      />
                    ) : vehicle.id === 'auto' ? (
                      <div className={isSelected ? vehicle.iconColor : 'text-gray-600'}>
                        {getAutoIcon()}
                      </div>
                    ) : (
                      <VehicleIcon
                        size={32}
                        className={isSelected ? vehicle.iconColor : 'text-gray-600'}
                      />
                    )}
                  </div>

                  {/* Vehicle Details */}
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-lg text-gray-800">{vehicle.name}</h4>
                      <div className="flex items-center text-yellow-500">
                        <Star size={14} fill="currentColor" />
                        <span className="text-xs ml-1 text-gray-600">4.8</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{vehicle.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center">
                        <User size={12} className="mr-1" />
                        <span>{vehicle.capacity} seats</span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={12} className="mr-1" />
                        <span>{vehicle.time}</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex gap-2 mt-2">
                      {vehicle.features.map((feature, index) => (
                        <span 
                          key={index}
                          className={`text-xs px-2 py-1 rounded-full ${
                            isSelected 
                              ? 'bg-white text-gray-700' 
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-800">₹{vehicle.price}</div>
                    <div className="text-xs text-gray-500">Total fare</div>
                    {isSelected && (
                      <div className="mt-2">
                        <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            )
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="bg-gray-50 p-4 border-t border-gray-200">
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
          <div className="flex items-center">
            <Shield size={14} className="mr-1" />
            <span>Insured rides</span>
          </div>
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          <div className="flex items-center">
            <Zap size={14} className="mr-1" />
            <span>Live tracking</span>
          </div>
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          <span>24/7 support</span>
        </div>
      </div>
    </div>
  )
}

export default VehiclePanel