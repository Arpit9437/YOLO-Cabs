import { useState, useCallback, useContext, useEffect } from "react";
import { MapPin, X, Menu, Search, Navigation } from "lucide-react";
import { debounce } from "lodash";
import axios from "axios";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConfirmRide";
import WaitingForDriver from "../components/WaitingForDriver";
import LookingForDriver from "../components/LookingForDriver";
import { SocketContext } from "../context/SocketContext";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import LiveTracking from "../components/LiveTracking";
import UserLogoutButton from "../components/LogoutUser";
import logo from "../assets/logo.png";


const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [activePanel, setActivePanel] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [ride, setRide] = useState(null);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [fareData, setFareData] = useState(null);
  const [isFareLoading, setIsFareLoading] = useState(false);
  const [vehicleType, setVehicleType] = useState(null);
  const { user } = useContext(UserDataContext);
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();

  const fetchFare = async (pickupLocation, destinationLocation) => {
    if (!pickupLocation || !destinationLocation) return;

    setIsFareLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/rides/get-fare`,
        {
          params: {
            pickup: pickupLocation,
            destination: destinationLocation,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFareData(response.data);
    } catch (error) {
      console.error("Error fetching fare:", error);
      setFareData({ auto: 35, car: 58, moto: 24 });
    } finally {
      setIsFareLoading(false);
    }
  };

  useEffect(() => {
    if (activePanel === "vehicle" && pickup && destination) {
      fetchFare(pickup, destination);
    }
  }, [activePanel, pickup, destination]);

  useEffect(() => {
    socket.emit("join", { userType: "user", userId: user._id });
  }, [user]);

  socket.on("ride-confirmed", (ride) => {
    setActivePanel("waiting");
    setRide(ride);
  });
  socket.on("ride-started", (ride) => {
    console.log("ride");
    navigate("/riding", { state: { ride } });
  });

  const fetchSuggestions = async (input) => {
    if (!input || input.length < 3) {
      setLocationSuggestions([]);
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/maps/get-suggestions`,
        {
          params: { input },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLocationSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setLocationSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const debouncedFetchSuggestions = useCallback(
    debounce((input) => fetchSuggestions(input), 300),
    []
  );

  const handleLocationSelect = (location) => {
    if (activeField === "pickup") {
      setPickup(location.description);
    } else if (activeField === "destination") {
      setDestination(location.description);
      if (pickup) {
        setIsSearchActive(false);
        setActivePanel("vehicle");
      }
    }
    setLocationSuggestions([]);
  };

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    setActivePanel("confirm");
  };

  const handleConfirmRide = () => {
    setActivePanel("lookingForDriver");
  };

  async function createRide(vehicleType) {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/rides/create`,
      {
        pickup,
        destination,
        vehicleType,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  }

  return (
    <div className="h-screen relative overflow-hidden bg-gray-50">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-white bg-opacity-95 backdrop-blur-sm shadow-sm">
        <div className="flex justify-between items-center p-4 md:p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden">
              <img
                src={logo}
                alt="My Profile"
                className="w-10 h-10 object-cover rounded-full"
              />
            </div>
            <h1 className="text-xl font-bold text-gray-800">YOLO Cabs</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Online</span>
            </div>
            <UserLogoutButton />
          </div>
        </div>
      </div>

      {/* Map Background */}
      <div className="h-screen w-screen pt-16">
        <LiveTracking pickup={pickup} destination={destination} />
      </div>

      {/* Quick Action Buttons */}
      {!isSearchActive && !activePanel && (
        <div className="absolute top-24 right-4 z-10 space-y-3">
          <button className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
            <Navigation size={20} className="text-gray-600" />
          </button>
          <button className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
            <Menu size={20} className="text-gray-600" />
          </button>
        </div>
      )}

      {/* Search Panel */}
      <div
        className={`fixed inset-x-0 transition-all duration-300 ease-in-out ${
          isSearchActive ? "top-0 h-full bg-white z-30" : "bottom-0 z-10"
        }`}
      >
        <div className="bg-white rounded-t-3xl shadow-2xl">
          {isSearchActive && (
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800">Search Location</h3>
              <button
                onClick={() => {
                  setIsSearchActive(false);
                  setLocationSuggestions([]);
                  setActiveField(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>
          )}

          <div className="p-6">
            {!isSearchActive && (
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-2xl font-bold text-gray-800">Where to?</h4>
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                  <div className="w-2 h-2 bg-yellow-200 rounded-full"></div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <input
                  type="text"
                  placeholder="Pickup location"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-xl border-2 border-transparent focus:border-yellow-400 focus:bg-white transition-all duration-200 text-gray-800 placeholder-gray-500"
                  value={pickup}
                  onChange={(e) => {
                    setPickup(e.target.value);
                    debouncedFetchSuggestions(e.target.value);
                  }}
                  onFocus={() => {
                    setIsSearchActive(true);
                    setActiveField("pickup");
                  }}
                />
              </div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                </div>
                <input
                  type="text"
                  placeholder="Where to?"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-xl border-2 border-transparent focus:border-yellow-400 focus:bg-white transition-all duration-200 text-gray-800 placeholder-gray-500"
                  value={destination}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    debouncedFetchSuggestions(e.target.value);
                  }}
                  onFocus={() => {
                    setIsSearchActive(true);
                    setActiveField("destination");
                  }}
                />
              </div>

              {!isSearchActive && pickup && destination && (
                <button
                  onClick={() => setActivePanel("vehicle")}
                  className="w-full bg-gradient-to-r from-yellow-400 to-amber-400 text-gray-800 py-4 rounded-xl font-semibold text-lg hover:from-yellow-500 hover:to-amber-500 transition-all duration-200 shadow-lg"
                >
                  Find Your Ride
                </button>
              )}

              {/* {!isSearchActive && !pickup && !destination && (
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <button className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <MapPin size={20} className="text-yellow-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-800 text-sm">Home</div>
                      <div className="text-xs text-gray-500">Add home address</div>
                    </div>
                  </button>
                  <button className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <MapPin size={20} className="text-blue-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-800 text-sm">Work</div>
                      <div className="text-xs text-gray-500">Add work address</div>
                    </div>
                  </button>
                </div>
              )} */}
            </div>

            {isSearchActive && (
              <div className="mt-6">
                <LocationSearchPanel
                  suggestions={locationSuggestions}
                  onLocationSelect={handleLocationSelect}
                  isLoading={isLoadingSuggestions}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Vehicle Selection Panel */}
      {activePanel === "vehicle" && (
        <div className="fixed inset-x-0 bottom-0 z-20">
          <VehiclePanel
            onClose={() => setActivePanel(null)}
            onVehicleSelect={handleVehicleSelect}
            fare={fareData}
            isLoading={isFareLoading}
            selectedVehicle={setVehicleType}
            pickup={pickup}
            destination={destination}
          />
        </div>
      )}

      {/* Confirm Ride Panel */}
      {activePanel === "confirm" && (
        <div className="fixed inset-x-0 bottom-0 z-20">
          <ConfirmRide
            onClose={() => setActivePanel("vehicle")}
            onConfirmRide={handleConfirmRide}
            pickup={pickup}
            destination={destination}
            selectedVehicle={selectedVehicle}
            createRide={createRide}
          />
        </div>
      )}

      {/* Looking for Driver Panel */}
      {activePanel === "lookingForDriver" && (
        <div className="fixed inset-x-0 bottom-0 z-20">
          <LookingForDriver
            pickup={pickup}
            destination={destination}
            selectedVehicle={selectedVehicle}
            setVehicleFound={setVehicleFound}
            setActivePanel={setActivePanel}
            onClose={() => setActivePanel("confirm")}
          />
        </div>
      )}

      {/* Waiting for Driver Panel */}
      {activePanel === "waiting" && (
        <div className="fixed inset-x-0 bottom-0 z-20">
          <WaitingForDriver
            onClose={() => setActivePanel("confirm")}
            ride={ride}
          />
        </div>
      )}
    </div>
  );
};

export default Home;