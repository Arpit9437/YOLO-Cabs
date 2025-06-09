import { useState, useEffect } from "react"
import { Clock, Star, TrendingUp, DollarSign, Car } from "lucide-react"

const CaptainDetails = () => {
  const [captain, setCaptain] = useState(null)

  useEffect(() => {
    const storedCaptain = localStorage.getItem("captain")
    if (storedCaptain) {
      setCaptain(JSON.parse(storedCaptain))
    }
  }, [])

  const getVehicleIcon = () => {
    if (!captain?.vehicle?.vehicleType) return <Car className="w-6 h-6 text-green-600" />

    switch (captain.vehicle.vehicleType) {
      case "moto":
        return (
          <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zm-.5 1.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z" />
          </svg>
        )
      case "auto":
        return (
          <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L8 6v6h8V6l-4-4zm0 2.5L13.5 6h-3L12 4.5z" />
          </svg>
        )
      default:
        return <Car className="w-6 h-6 text-green-600" />
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl flex items-center justify-center">
            {getVehicleIcon()}
          </div>
          <div>
            {captain && (
              <h4 className="text-2xl font-bold text-gray-800 capitalize">
                {`${captain.fullname.firstname} ${captain.fullname.lastname}`}
              </h4>
            )}
            <p className="text-gray-600 font-medium">
              {captain?.vehicle?.vehicleType === "moto"
                ? "Bike"
                : captain?.vehicle?.vehicleType === "auto"
                  ? "Auto"
                  : "Car"}{" "}
              Captain
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-5 h-5 text-green-600" />
            <h4 className="text-2xl font-bold text-green-600">₹295.20</h4>
          </div>
          <p className="text-sm text-gray-600">Earned Today</p>
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Vehicle</p>
            <p className="font-bold text-gray-800">{captain?.vehicle?.plate || "XX XX XX XXXX"}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Color</p>
            <p className="font-bold text-gray-800 capitalize">{captain?.vehicle?.color || "White"}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-center mb-2">
            <Clock className="text-blue-600" size={24} />
          </div>
          <h5 className="text-xl font-bold text-gray-800">10.2</h5>
          <p className="text-sm text-gray-600 font-medium">Hours Online</p>
        </div>

        <div className="text-center bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="text-green-600" size={24} />
          </div>
          <h5 className="text-xl font-bold text-gray-800">25</h5>
          <p className="text-sm text-gray-600 font-medium">Trips Today</p>
        </div>

        <div className="text-center bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-4 border border-yellow-200">
          <div className="flex items-center justify-center mb-2">
            <Star className="text-yellow-600" size={24} fill="currentColor" />
          </div>
          <h5 className="text-xl font-bold text-gray-800">4.8</h5>
          <p className="text-sm text-gray-600 font-medium">Rating</p>
        </div>
      </div>
    </div>
  )
}

export default CaptainDetails
