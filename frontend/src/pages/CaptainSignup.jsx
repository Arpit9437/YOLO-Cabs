"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  User,
  Mail,
  Lock,
  Car,
  Palette,
  Hash,
  Users,
  ChevronDown,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Bike,
} from "lucide-react"
import axios from "axios"

const CaptainSignup = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    vehicleColor: "",
    vehiclePlate: "",
    vehicleCapacity: "",
    vehicleType: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const AutoIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2L8 6v6h8V6l-4-4zm0 2.5L13.5 6h-3L12 4.5zM19 13h-2v2h2v-2zm-8 0H9v2h2v-2zm-6 0H3v2h2v-2zm14 4h-2v2h2v-2zm-8 0H9v2h2v-2zm-6 0H3v2h2v-2z" />
    </svg>
  )

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (error) setError("")
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const captainData = {
        fullname: {
          firstname: formData.firstName,
          lastname: formData.lastName,
        },
        email: formData.email,
        password: formData.password,
        vehicle: {
          color: formData.vehicleColor,
          plate: formData.vehiclePlate,
          capacity: formData.vehicleCapacity,
          vehicleType: formData.vehicleType,
        },
      }

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/captains/register`, captainData)

      if (response.status === 201) {
        const data = response.data
        localStorage.setItem("captain", JSON.stringify(data.captain))
        localStorage.setItem("token", data.token)
        navigate("/captain-home")
      }
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }

    setFormData({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      vehicleColor: "",
      vehiclePlate: "",
      vehicleCapacity: "",
      vehicleType: "",
    })
  }

  const vehicleTypes = [
    { value: "car", label: "Car", icon: Car },
    { value: "auto", label: "Auto Rickshaw", icon: AutoIcon },
    { value: "moto", label: "Motorcycle", icon: Bike },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </div>
        {/* Logo */}
        {/* <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Car className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">QuickRide Captain</h1>
          <p className="text-gray-600 mt-2">Join our captain network</p>
        </div> */}

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Become a Captain</h2>
          <p className="text-gray-600 mb-8">Start earning with flexible hours</p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
              <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-medium">Registration Failed</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={submitHandler} className="space-y-8">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-green-600" />
                Personal Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    required
                    name="firstName"
                    type="text"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all"
                  />
                </div>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    required
                    name="lastName"
                    type="text"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-green-600" />
                Contact Details
              </h3>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  required
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all"
                />
              </div>
            </div>

            {/* Security */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-green-600" />
                Security
              </h3>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  required
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Vehicle Details */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Car className="w-5 h-5 text-green-600" />
                Vehicle Details
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Palette className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      required
                      name="vehicleColor"
                      type="text"
                      placeholder="Vehicle color"
                      value={formData.vehicleColor}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all"
                    />
                  </div>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      required
                      name="vehiclePlate"
                      type="text"
                      placeholder="License plate"
                      value={formData.vehiclePlate}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      required
                      name="vehicleCapacity"
                      type="number"
                      placeholder="Capacity"
                      value={formData.vehicleCapacity}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all"
                    />
                  </div>
                  <div className="relative">
                    <Car className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    <select
                      required
                      name="vehicleType"
                      value={formData.vehicleType}
                      onChange={handleChange}
                      className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled>
                        Vehicle type
                      </option>
                      {vehicleTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms */}
            {/* <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-4 rounded-xl">
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-700 font-medium mb-1">By registering, you agree to our:</p>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <Link to="/captain-terms" className="text-green-600 hover:text-green-700 font-medium">
                      Captain Terms
                    </Link>
                    <span className="text-gray-400">•</span>
                    <Link to="/privacy" className="text-green-600 hover:text-green-700 font-medium">
                      Privacy Policy
                    </Link>
                  </div>
                </div>
              </div>
            </div> */}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-400 to-emerald-400 text-white py-4 rounded-xl font-bold hover:from-green-500 hover:to-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </>
              ) : (
                "Start Your Journey"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already driving with us?{" "}
              <Link to="/captain-login" className="text-green-600 font-medium hover:text-green-700 transition-colors">
                Sign in to your account
              </Link>
            </p>
          </div>
        </div>

        {/* User Login Link */}
        {/* <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Looking for a ride?</p>
          <Link
            to="/login"
            className="block w-full py-4 text-center bg-gradient-to-r from-yellow-400 to-amber-400 text-gray-800 rounded-xl font-bold hover:from-yellow-500 hover:to-amber-500 transition-all shadow-lg"
          >
            Sign in as Customer
          </Link>
        </div> */}
      </div>
    </div>
  )
}

export default CaptainSignup
