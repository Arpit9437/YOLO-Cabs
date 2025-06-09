import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Loader2, LogOut } from "lucide-react"
import axios from "axios"

export const CaptainLogout = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")

    axios
      .get(`${import.meta.env.VITE_API_URL}/captains/logout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          localStorage.removeItem("token")
          localStorage.removeItem("captain")
          navigate("/")
        }
      })
      .catch((error) => {
        console.error("Logout failed:", error)
        // Still remove tokens and redirect on error
        localStorage.removeItem("token")
        localStorage.removeItem("captain")
        navigate("/")
      })
  }, [navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <LogOut className="w-10 h-10 text-white" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">Signing Out</h2>

        <div className="flex items-center justify-center gap-3 mb-6">
          <Loader2 className="w-6 h-6 animate-spin text-green-500" />
          <p className="text-gray-600 font-medium">Please wait while we sign you out...</p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-sm text-gray-600">Thank you for driving with QuickRide. Drive safe!</p>
        </div>
      </div>
    </div>
  )
}

export default CaptainLogout
