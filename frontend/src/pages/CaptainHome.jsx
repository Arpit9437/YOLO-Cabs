import { useState, useEffect, useContext } from "react"
import CaptainDetails from "../components/CaptainDetails"
import RidePopUp from "../components/RidePopUp"
import ConfirmRidePopUp from "../components/ConfirmRidePopUp"
import CaptainStats from "../components/CaptainStats"
import { SocketContext } from "../context/SocketContext"
import axios from "axios"
import LiveTracking from "../components/LiveTracking"
import LogoutButton from "../components/LogoutCaptain"

const CaptainHome = () => {
  const [ridePopupPanel, setRidePopupPanel] = useState(false)
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false)
  const [ride, setRide] = useState(null)
  const [captain, setCaptain] = useState(null)
  const { socket } = useContext(SocketContext)

  useEffect(() => {
    const storedCaptain = localStorage.getItem("captain")
    if (storedCaptain) {
      try {
        const parsedCaptain = JSON.parse(storedCaptain)
        setCaptain(parsedCaptain)
        fetchCaptainStats(parsedCaptain._id)
      } catch (error) {
        console.error("Error parsing captain data:", error)
        localStorage.removeItem("captain")
      }
    }
  }, [])

  const fetchCaptainStats = async (captainId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/captains/stats/${captainId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      setCaptain(response.data.captain)
      localStorage.setItem("captain", JSON.stringify(response.data.captain))
    } catch (error) {
      console.error("Error fetching captain stats:", error)
    }
  }

  useEffect(() => {
    socket?.on("new-ride", (data) => {
      setRide(data)
      setRidePopupPanel(true)
    })

    socket?.on("earnings-updated", (data) => {
      setCaptain((prev) => ({
        ...prev,
        earnings: data.earnings,
        totalRides: data.totalRides,
      }))
    })
  }, [socket])

  useEffect(() => {
    if (!captain?._id || !socket) return

    socket.emit("join", { userType: "captain", userId: captain._id })

    const updateLocation = () => {
      if (!navigator.geolocation) {
        console.error("Geolocation is not supported by this browser.")
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          socket.emit("update-location-captain", {
            userId: captain._id,
            location: {
              ltd: position.coords.latitude,
              lng: position.coords.longitude,
            },
          })
        },
        (error) => {
          console.error("Error getting location:", error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      )
    }

    updateLocation()
    const locationInterval = setInterval(updateLocation, 10000)

    return () => clearInterval(locationInterval)
  }, [captain, socket])

  const confirmRide = async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/rides/confirm`,
      {
        rideId: ride._id,
        captainId: captain._id,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    )

    setRidePopupPanel(false)
    setConfirmRidePopupPanel(true)
  }

  if (!captain) return null

  return (
    <div className="h-screen relative bg-gray-50">
      {/* Header with Captain Status */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-r from-green-400 to-emerald-400 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <span className="text-white font-bold">Online & Ready</span>
          </div>
          <LogoutButton />
        </div>
      </div>

      {/* Map Section */}
      <div className="h-3/5 pt-16">
        <LiveTracking pickup={ride?.pickup} destination={ride?.destination} />
      </div>

      {/* Captain Details and Stats Section */}
      <div className="h-2/5 p-6 bg-white overflow-y-auto">
        {/* Captain Stats */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Your Performance</h3>
          <CaptainStats captain={captain} />
        </div>

        {/* Captain Details */}
        <CaptainDetails />
      </div>

      {/* Ride Request Popup */}
      <div
        className={`fixed w-full z-30 bottom-0 bg-white rounded-t-3xl shadow-2xl border-t-4 border-green-400 transition-transform duration-300 ${
          ridePopupPanel ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <RidePopUp
          ride={ride}
          setRidePopupPanel={setRidePopupPanel}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          confirmRide={confirmRide}
        />
      </div>

      {/* Confirm Ride Popup */}
      <div
        className={`fixed w-full z-30 bottom-0 bg-white rounded-t-3xl shadow-2xl border-t-4 border-yellow-400 transition-transform duration-300 ${
          confirmRidePopupPanel ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <ConfirmRidePopUp
          ride={ride}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          setRidePopupPanel={setRidePopupPanel}
        />
      </div>
    </div>
  )
}

export default CaptainHome
