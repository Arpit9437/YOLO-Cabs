import { useContext, useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Home, Wallet, Car, Phone, MessageCircle, Star, Clock } from "lucide-react"
import { SocketContext } from "../context/SocketContext"
import LiveTracking from "../components/LiveTracking"
import RatingModal from "../components/RatingModal"
import axios from "axios"

const Riding = () => {
  const location = useLocation()
  const { ride } = location.state || {}
  const navigate = useNavigate()
  const { socket } = useContext(SocketContext)
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [rideEnded, setRideEnded] = useState(false)

  useEffect(() => {
    socket.on("ride-ended", (endedRide) => {
      setRideEnded(true)
      setShowRatingModal(true)
    })

    return () => {
      socket.off("ride-ended")
    }
  }, [socket])

  const handleRatingSubmit = async (ratingData) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/ratings/submit`, ratingData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      setShowRatingModal(false)
      navigate("/home")
    } catch (error) {
      console.error("Error submitting rating:", error)
      // Still navigate to home even if rating fails
      setShowRatingModal(false)
      navigate("/home")
    }
  }

  const handleSkipRating = () => {
    setShowRatingModal(false)
    navigate("/home")
  }

  const handlePayment = () => {
    console.log("Processing payment...")
  }

  const getVehicleIcon = () => {
    switch (ride?.captain?.vehicle?.vehicleType) {
      case "moto":
        return (
          <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zm-.5 1.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z" />
          </svg>
        )
      case "auto":
        return (
          <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L8 6v6h8V6l-4-4zm0 2.5L13.5 6h-3L12 4.5z" />
          </svg>
        )
      default:
        return <Car className="w-8 h-8 text-green-600" />
    }
  }

  return (
    <div className="h-screen relative overflow-hidden bg-gray-50">
      {/* Map Section */}
      <div className="h-screen w-screen">
        <LiveTracking pickup={ride?.pickup} destination={ride?.destination} />
      </div>

      {/* Header Status */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-r from-yellow-400 to-amber-400 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <span className="text-gray-800 font-bold">{rideEnded ? "Trip Completed" : "Trip in Progress"}</span>
          </div>
          <Link
            to="/home"
            className="h-10 w-10 bg-white bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center rounded-full transition-all backdrop-blur-sm"
          >
            <Home className="w-5 h-5 text-gray-800" />
          </Link>
        </div>
      </div>

      {/* Ride Details Section */}
      <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl border-t-4 border-yellow-400 z-30">
        <div className="p-6">
          <div className="space-y-6">
            {/* Driver & Vehicle Info */}
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-5 rounded-2xl border border-yellow-200">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  {getVehicleIcon()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-xl font-bold text-gray-800 capitalize">
                      {ride?.captain?.fullname?.firstname || "Captain"} {ride?.captain?.fullname?.lastname || ""}
                    </h4>
                    <div className="flex items-center text-yellow-500">
                      <Star size={14} fill="currentColor" />
                      <span className="text-sm ml-1 text-gray-600">
                        {ride?.captain?.rating?.average ? ride.captain.rating.average.toFixed(1) : "New"}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 font-medium mb-2">{ride?.captain?.vehicle?.plate || "XX XX XX XXXX"}</p>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                      <Phone size={14} />
                      <span>Call</span>
                    </button>
                    <button className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                      <MessageCircle size={14} />
                      <span>Chat</span>
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800">₹{ride?.fare || "0"}</div>
                  <div className="text-xs text-gray-500">Total fare</div>
                </div>
              </div>
            </div>

            {/* Trip Details */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-4 h-4 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Pickup</p>
                  <p className="font-medium text-gray-800 leading-relaxed">{ride?.pickup || "Pickup Address"}</p>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="w-px h-8 bg-gray-300"></div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-4 h-4 bg-red-500 rounded-full mt-1 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Destination</p>
                  <p className="font-medium text-gray-800 leading-relaxed">
                    {ride?.destination || "Destination Address"}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Wallet size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Cash Payment</p>
                    <p className="text-sm text-gray-600">Pay directly to captain</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-800">₹{ride?.fare || "0"}</div>
                  <div className="text-xs text-gray-500">Total</div>
                </div>
              </div>
            </div>

            {/* Trip Status */}
            <div
              className={`p-4 rounded-xl border ${rideEnded ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200"}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${rideEnded ? "bg-green-100" : "bg-blue-100"}`}
                >
                  {rideEnded ? (
                    <Star size={16} className="text-green-600" />
                  ) : (
                    <Clock size={16} className="text-blue-600" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">{rideEnded ? "Trip Completed" : "Trip in Progress"}</h4>
                  <p className="text-sm text-gray-600">
                    {rideEnded ? "Please rate your experience" : "Your captain is on the way to destination"}
                  </p>
                </div>
              </div>
            </div>

            {/* Emergency Button */}
            <button
              onClick={handlePayment}
              className="w-full bg-gradient-to-r from-yellow-400 to-amber-400 text-gray-800 font-bold py-4 rounded-xl hover:from-yellow-500 hover:to-amber-500 transition-all shadow-lg"
            >
              Emergency Contact
            </button>
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      <RatingModal
        isOpen={showRatingModal}
        onClose={handleSkipRating}
        captain={ride?.captain}
        ride={ride}
        onSubmitRating={handleRatingSubmit}
      />
    </div>
  )
}

export default Riding
