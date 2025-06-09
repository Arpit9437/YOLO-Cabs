"use client"

import { useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Loader2, LogOut } from "lucide-react"

export const UserLogout = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")

    axios
      .get(`${import.meta.env.VITE_API_URL}/users/logout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          localStorage.removeItem("token")
          navigate("/login")
        }
      })
      .catch((error) => {
        console.error("Logout error:", error)
        // Still remove token and redirect on error
        localStorage.removeItem("token")
        navigate("/")
      })
  }, [navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <LogOut className="w-10 h-10 text-gray-800" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">Signing Out</h2>

        <div className="flex items-center justify-center gap-3 mb-6">
          <Loader2 className="w-6 h-6 animate-spin text-yellow-500" />
          <p className="text-gray-600 font-medium">Please wait while we sign you out...</p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-sm text-gray-600">Thank you for using QuickRide. Have a safe journey!</p>
        </div>
      </div>
    </div>
  )
}

export default UserLogout
