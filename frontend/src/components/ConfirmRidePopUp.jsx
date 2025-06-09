import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import { Clock, User, Shield } from "lucide-react"

const ConfirmRidePopUp = ({ ride, setConfirmRidePopupPanel, setRidePopupPanel }) => {
  const [otp, setOtp] = useState("")
  const navigate = useNavigate()
  const [durations, setDurations] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const submitHandler = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/rides/start-ride`, {
        params: {
          rideId: ride._id,
          otp: otp,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.status === 200) {
        setConfirmRidePopupPanel(false)
        setRidePopupPanel(false)
        navigate("/captain-riding", { state: { ride: ride } })
      }
    } catch (error) {
      console.error("Error starting ride:", error)
    } finally {
      setIsLoading(false)
    }
  }

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
          <h3 className="text-2xl font-bold text-gray-800">Confirm Trip Details</h3>
          {durations?.duration && (
            <div className="flex items-center text-gray-600 mt-1">
              <Clock size={16} className="mr-1" />
              <span className="text-sm font-medium">{durations.duration.text}</span>
              {durations?.distance && <span className="text-sm text-gray-500 ml-2">• {durations.distance.text}</span>}
            </div>
          )}
        </div>
      </div>

      {/* Passenger Info */}
      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-5 mb-6">
        <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Passenger</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
              <User className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="font-bold text-gray-800 capitalize">{ride?.user?.fullname?.firstname || "User"}</p>
              <p className="text-sm text-gray-600">{durations?.distance?.text || "Calculating..."}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-800">₹{ride?.fare}</p>
            <p className="text-sm text-gray-500">Cash</p>
          </div>
        </div>
      </div>

      {/* Trip Route */}
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
            <div className="w-4 h-4 bg-red-500 rounded-full mt-1 flex-shrink-0"></div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Destination</p>
              <p className="font-medium text-gray-800 leading-relaxed">{ride?.destination || "562/11-A"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Section */}
      <form onSubmit={submitHandler} className="space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-blue-600" />
            <div>
              <h4 className="font-bold text-gray-800">Verification Required</h4>
              <p className="text-sm text-gray-600">Enter the OTP provided by the passenger</p>
            </div>
          </div>

          <input
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            type="text"
            className="w-full px-4 py-4 bg-white border border-blue-200 rounded-xl font-mono text-2xl text-center focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all tracking-widest"
            placeholder="000000"
            maxLength="6"
            required
          />
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className="w-full bg-gradient-to-r from-yellow-400 to-amber-400 text-gray-800 font-bold py-4 rounded-xl hover:from-yellow-500 hover:to-amber-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                Starting Trip...
              </div>
            ) : (
              "Start Trip"
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setConfirmRidePopupPanel(false)
              setRidePopupPanel(false)
            }}
            className="w-full border-2 border-gray-300 text-gray-700 font-bold py-4 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default ConfirmRidePopUp
