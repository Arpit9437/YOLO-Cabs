import { useContext, useState } from "react"
import { Eye, EyeOff, Mail, Lock, Car, AlertCircle } from 'lucide-react'
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { UserDataContext } from "../context/UserContext"

const LoginPage = () => {
  const navigate = useNavigate()
  const { setUser } = useContext(UserDataContext)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (error) setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const userLogin = {
        email: formData.email,
        password: formData.password
      }

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, userLogin)

      if(response.status === 200) {
        const data = response.data
        setUser(data.user)
        localStorage.setItem('token', data.token)
        navigate("/home")
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }

    setFormData({
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

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
          <p className="text-gray-600 mb-8">Sign in to continue your journey</p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
              <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-medium">Login Failed</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-yellow-600 font-medium text-sm hover:text-yellow-700 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-yellow-400 to-amber-400 text-gray-800 font-bold py-4 rounded-xl hover:from-yellow-500 hover:to-amber-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            <p className="text-center text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-yellow-600 font-medium hover:text-yellow-700 transition-colors">
                Sign up
              </Link>
            </p>
          </form>
        </div>

        {/* Captain Login Button */}
        {/* <div className="mt-8">
          <Link
            to="/captain-login"
            className="block w-full py-4 text-center bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-xl font-bold hover:from-green-500 hover:to-emerald-500 transition-all shadow-lg"
          >
            Sign in as Captain
          </Link>
        </div> */}
      </div>
    </div>
  )
}

export default LoginPage
