import { useNavigate } from "react-router-dom";
import { LogOut, Power } from "lucide-react";
import { useState } from "react";
import axios from "axios";

const UserLogoutButton = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await axios.get(`${import.meta.env.VITE_API_URL}/users/logout`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="group relative h-12 w-12 bg-white hover:bg-red-50 flex items-center justify-center rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100 disabled:opacity-50"
      aria-label="Logout"
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
      ) : (
        <LogOut 
          size={20} 
          className="text-gray-600 group-hover:text-red-600 transition-colors duration-200" 
        />
      )}
      
      {/* Tooltip */}
      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        Logout
        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
      </div>
    </button>
  );
};

export default UserLogoutButton;