import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { User, CreditCard, Clock, CheckCircle, Star } from "lucide-react"
import axios from "axios"

const FinishRide = ({ onClose, ride }) => {
  const navigate = useNavigate()
  const [durations, setDurations] = useState({})
  const [isLoading, setIsLoading] = useState(false)

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

  async function endRide() {
    setIsLoading(true)
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/rides/end-ride`,
        {
          rideId: ride._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )

      if (response.status === 200) {
        navigate("/captain-home")
      }
    } catch (error) {
      console.error("Error ending ride:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Complete Trip</h3>
          {durations?.duration && (
            <div className="flex items-center text-gray-600 mt-1">
              <Clock size={16} className="mr-1" />
              <span className="text-sm font-medium">{durations.duration.text}</span>
              {durations?.distance && <span className="text-sm text-gray-500 ml-2">• {durations.distance.text}</span>}
            </div>
          )}
        </div>
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>
      </div>

      {/* Passenger Info */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5 mb-6">
        <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Passenger</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
              <User className="text-green-600" size={24} />
            </div>
            <div>
              <p className="font-bold text-gray-800 capitalize">{ride?.user?.fullname?.firstname || "Passenger"}</p>
              <div className="flex items-center gap-2 mt-1">
                <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                <span className="text-sm text-gray-600">Trip completed successfully</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-600">₹{ride?.fare || "150"}</p>
            <p className="text-sm text-gray-500">Total fare</p>
          </div>
        </div>
      </div>

      {/* Trip Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-6">
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
            <div className="w-4 h-4 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Destination</p>
              <p className="font-medium text-gray-800 leading-relaxed">{ride?.destination || "562/11-A"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Info */}
      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-5 mb-6">
        <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Payment</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <CreditCard className="text-yellow-600" size={20} />
            </div>
            <div>
              <p className="font-bold text-gray-800">Cash Payment</p>
              <p className="text-sm text-gray-600">Collect ₹{ride?.fare || "150"} from passenger</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-gray-800">₹{ride?.fare || "150"}</div>
            <div className="text-xs text-gray-500">Cash</div>
          </div>
        </div>
      </div>

      {/* Complete Button */}
      <button
        onClick={endRide}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-green-400 to-emerald-400 text-white font-bold py-4 rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Completing Trip...
          </div>
        ) : (
          "Complete Trip"
        )}
      </button>
    </div>
  )
}

export default FinishRide
