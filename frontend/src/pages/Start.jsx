import { Link } from "react-router-dom"
import brandlogo from "../assets/brand.png"
import logo from "../assets/logo.png"

const Start = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-yellow-300 to-amber-200 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-6 md:p-8">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden">
            {/* Replace SVG with your image */}
            <img
              src={logo}
              alt="My Profile"
              className="w-10 h-10 object-cover rounded-full"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">YOLO Cabs</h1>
        </div>
        {/* <img
          src={logo}
          alt="Profile"
          className="w-12 h-12 rounded-full object-cover shadow-lg"
        /> */}
        {/* <div className="hidden md:flex space-x-6 text-gray-700">
          <a href="#" className="hover:text-gray-900 transition-colors">About</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Contact</a>
        </div> */}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="text-center md:text-left">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
              Your Ride,
              <span className="block text-gray-600">Just a Tap Away</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              Book cars, auto-rickshaws, or bikes instantly. Safe, reliable, and affordable rides across the city.
            </p>
            
            {/* Vehicle Types */}
            {/* <div className="flex justify-center md:justify-start space-x-8 mb-10">
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-2 mx-auto">
                  <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-600">Cars</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-2 mx-auto">
                  <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L8 6v6h8V6l-4-4zm0 2.5L13.5 6h-3L12 4.5zM19 13h-2v2h2v-2zm-8 0H9v2h2v-2zm-6 0H3v2h2v-2zm14 4h-2v2h2v-2zm-8 0H9v2h2v-2zm-6 0H3v2h2v-2z"/>
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-600">Auto</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-2 mx-auto">
                  <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zm-.5 1.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM20 12l-1.5-1.5L17 12l1.5 1.5L20 12zm-8 0l-1.5-1.5L9 12l1.5 1.5L12 12zm-8 0L2.5 10.5 1 12l1.5 1.5L4 12z"/>
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-600">Bikes</span>
              </div>
            </div> */}

            {/* CTA Buttons */}
            <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex">
              <Link
                to="/login"
                className="block md:inline-block bg-gray-800 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-700 transition-colors shadow-lg"
              >
                Book as Customer
              </Link>
              <Link
                to="/captain-login"
                className="block md:inline-block bg-white text-gray-800 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-colors shadow-lg border-2 border-gray-200"
              >
                Drive with Us
              </Link>
            </div>
          </div>

          {/* Right Side - Visual */}
          <div className="relative flex items-center justify-center">
            <img
              src={brandlogo} // Replace with your actual image path
              alt="QuickRide Visual"
              className="rounded-3xl shadow-2xl max-w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white bg-opacity-20 backdrop-blur-sm mt-16">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Safe & Reliable</h3>
              <p className="text-gray-600">Verified drivers and secure rides</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM6 18v-4h8v4H6z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">24/7 Available</h3>
              <p className="text-gray-600">Round the clock service</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Fair Pricing</h3>
              <p className="text-gray-600">Transparent and affordable rates</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Start