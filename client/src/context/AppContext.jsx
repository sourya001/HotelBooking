import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();
  const [isOwner, setIsOwner] = useState(false);
  const [showHotelReg, setShowHotelReg] = useState(false);
  const [searchedCities, setSearchedCities] = useState([]);
  const [rooms, setRooms] = useState([]);

  // Fetch rooms from the server
  const fetchRooms = async () => {
      try {
        console.log("Fetching rooms from:", axios.defaults.baseURL + "/api/rooms");
        const {data}= await axios.get("/api/rooms")
        if(data.success) {
          setRooms(data.rooms);
        }else{
          toast.error(data.message || "Failed to fetch rooms");
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
        if (error.response) {
          toast.error(`Server error: ${error.response.status} - ${error.response.data?.message || error.message}`);
        } else if (error.request) {
          toast.error("Network error: Could not connect to server");
        } else {
          toast.error("An error occurred while fetching rooms");
        }
      }
    };

    // Fetch user data
    const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setIsOwner(data.role === "hotelOwner");
        setSearchedCities(data.recentSearchedCities || []);
      } else {
        // Retry fetching user data
        setTimeout(() => {
          fetchUser();
        }, 5000);
      }
    } catch (error) {
      toast.error("Failed to fetch user data. Retrying...");
    }
  };

  useEffect(() => {
    if (user) {
      fetchUser();
    }
  }, [user]);

  useEffect(() => {
    fetchRooms();
  }, []);

  const value = {
    currency,
    navigate,
    user,
    getToken,
    isOwner,
    setIsOwner,
    showHotelReg,
    setShowHotelReg,
    searchedCities,
    setSearchedCities,
    rooms,
    setRooms,
    axios,
    toast,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppProvider;
export const useAppContext = () => useContext(AppContext);
