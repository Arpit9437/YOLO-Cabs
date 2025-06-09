import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Mail, Lock, Eye, EyeOff, Car, AlertCircle } from "lucide-react"
import axios from "axios"

const CaptainLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

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
      const captain = { email: formData.email, password: formData.password }
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/captains/login`, captain)

      if (response.status === 200) {
        const data = response.data
        localStorage.setItem("captain", JSON.stringify(data.captain))
        localStorage.setItem("token", data.token)
        navigate("/captain-home")
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }

    setFormData({ email: "", password: "" })
  }

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
          <p className="text-gray-600 mt-2">Welcome back, Captain</p>
        </div> */}

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Captain Login</h2>
          <p className="text-gray-600 mb-8">Sign in to start earning</p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
              <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-medium">Login Failed</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={submitHandler} className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-green-600" />
                Login Details
              </h3>

              <div className="space-y-4">
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

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    required
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
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
            </div>

            <div className="flex justify-end">
              <Link
                to="/captain-forgot-password"
                className="text-green-600 font-medium text-sm hover:text-green-700 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-400 to-emerald-400 text-white font-bold py-4 rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing In...
                </>
              ) : (
                "Sign In as Captain"
              )}
            </button>

            <p className="text-center text-gray-600">
              Want to join our fleet?{" "}
              <Link to="/captain-signup" className="text-green-600 font-medium hover:text-green-700 transition-colors">
                Register as a Captain
              </Link>
            </p>
          </form>
        </div>

        {/* Customer Login Link */}
        {/* <div className="mt-8">
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

export default CaptainLogin
