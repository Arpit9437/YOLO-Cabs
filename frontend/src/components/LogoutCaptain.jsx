"use client"

import { useNavigate } from "react-router-dom"
import { LogOut } from "lucide-react"
import axios from "axios"

const LogoutButton = () => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_API_URL}/captains/logout`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      localStorage.removeItem("token")
      localStorage.removeItem("captain")
      navigate("/captain-login")
    } catch (error) {
      console.error("Logout failed:", error)
      localStorage.removeItem("token")
      localStorage.removeItem("captain")
      navigate("/captain-login")
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="h-10 w-10 bg-white bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center rounded-full transition-all backdrop-blur-sm"
      aria-label="Logout"
    >
      <LogOut className="w-5 h-5 text-white" />
    </button>
  )
}

export default LogoutButton
