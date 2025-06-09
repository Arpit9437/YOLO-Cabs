import { useEffect, useState } from "react"
import { User, Clock, MapPin, DollarSign } from "lucide-react"
import axios from "axios"

const RidePopUp = ({ ride, setRidePopupPanel, setConfirmRidePopupPanel, confirmRide }) => {
  const [durations, setDurations] = useState({})

  useEffect(() => {
    const fetchDurations = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/maps/get-distance-time`, {
          params: { origin: ride?.pickup, destination: ride?.destination },
          headers: { Authorization: `Bearer ${token}` },
        })
        setDurations(response.data)
      } catch (error) {
        console.error("Error fetching durations:", error)
      }
    }

    if (ride?.pickup && ride?.destination) {
      fetchDurations()
    }
  }, [ride?.pickup, ride?.destination])

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">New Ride Request</h3>
          {durations?.duration && (
            <div className="flex items-center text-gray-600 mt-1">
              <Clock size={16} className="mr-1" />
              <span className="text-sm font-medium">{durations.duration.text}</span>
              {durations?.distance && <span className="text-sm text-gray-500 ml-2">• {durations.distance.text}</span>}
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">₹{ride?.fare}</div>
          <div className="text-xs text-gray-500">Estimated fare</div>
        </div>
      </div>

      {/* Trip Route */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-5 mb-6">
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-4 h-4 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Pickup</p>
              <p className="font-medium text-gray-800 leading-relaxed">{ride?.pickup || "562/11-A"}</p>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-px h-8 bg-gray-300"></div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-4 h-4 bg-red-500 rounded-full mt-1 flex-shrink-0"></div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Destination</p>
              <p className="font-medium text-gray-800 leading-relaxed">{ride?.destination || "562/11-A"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Passenger Info */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-5 mb-6">
        <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Passenger</p>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
            <User className="text-blue-600" size={24} />
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-800 capitalize">
              {ride?.user?.fullname?.firstname} {ride?.user?.fullname?.lastname}
            </p>
            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center text-sm text-gray-600">
                <DollarSign size={14} className="mr-1" />
                <span>Cash Payment</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin size={14} className="mr-1" />
                <span>Pickup ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={() => {
            setConfirmRidePopupPanel(true)
            confirmRide()
          }}
          className="w-full bg-gradient-to-r from-green-400 to-emerald-400 text-white font-bold py-4 rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all shadow-lg"
        >
          Accept Trip
        </button>
        <button
          onClick={() => setRidePopupPanel(false)}
          className="w-full border-2 border-gray-300 text-gray-700 font-bold py-4 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all"
        >
          Decline
        </button>
      </div>
    </div>
  )
}

export default RidePopUp
