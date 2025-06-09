"use client"

import { useContext, useState } from "react"
import { Eye, EyeOff, User, Mail, Lock, Car, AlertCircle, CheckCircle } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { UserDataContext } from "../context/UserContext"

const SignupPage = () => {
  const navigate = useNavigate()
  const { setUser } = useContext(UserDataContext)
  const [formData, setFormData] = useState({
    fullname: {
      firstName: "",
      lastName: "",
    },
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === "firstName" || name === "lastName") {
      setFormData((prevState) => ({
        ...prevState,
        fullname: {
          ...prevState.fullname,
          [name]: value,
        },
      }))
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }))
    }
    // Clear error when user starts typing
    if (error) setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const newUser = {
        fullname: {
          firstname: formData.fullname.firstName,
          lastname: formData.fullname.lastName,
        },
        email: formData.email,
        password: formData.password,
      }

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/register`, newUser)

      if (response.status === 201) {
        const data = response.data
        setUser(data.user)
        localStorage.setItem("token", data.token)
        navigate("/home")
      }
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }

    setFormData({
      fullname: { firstName: "", lastName: "" },
      email: "",
      password: "",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 p-6">
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
        {/* <div className="text-center mb-4">
          <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Car className="w-10 h-10 text-gray-800" />
          </div> */}
          {/* <h1 className="text-3xl font-bold text-gray-800">QuickRide</h1>
          <p className="text-gray-600 mt-2">Join thousands of happy riders</p> */}
        {/* </div> */}

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h2>
          <p className="text-gray-600 mb-8">Start your journey with us today</p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
              <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-medium">Registration Failed</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={formData.fullname.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-4 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 bg-gray-50 transition-all"
                  required
                />
              </div>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={formData.fullname.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-4 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 bg-gray-50 transition-all"
                  required
                />
              </div>
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 bg-gray-50 transition-all"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 bg-gray-50 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-500" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-500" />
                )}
              </button>
            </div>

            {/* Terms and Conditions */}
            {/* <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 p-4 rounded-xl">
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-700 font-medium mb-1">By creating an account, you agree to our:</p>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <Link to="/terms" className="text-yellow-600 hover:text-yellow-700 font-medium">
                      Terms of Service
                    </Link>
                    <span className="text-gray-400">•</span>
                    <Link to="/privacy" className="text-yellow-600 hover:text-yellow-700 font-medium">
                      Privacy Policy
                    </Link>
                  </div>
                </div>
              </div>
            </div> */}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-yellow-400 to-amber-400 text-gray-800 py-4 rounded-xl font-bold hover:from-yellow-500 hover:to-amber-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-yellow-600 font-medium hover:text-yellow-700 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Captain Signup Link */}
        {/* <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Want to drive and earn?</p>
          <Link
            to="/captain-signup"
            className="block w-full py-4 text-center bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-xl font-bold hover:from-green-500 hover:to-emerald-500 transition-all shadow-lg"
          >
            Become a Captain
          </Link>
        </div> */}
      </div>
    </div>
  )
}

export default SignupPage
