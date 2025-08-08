import React, { useEffect, useState } from "react";
import Title from "../../components/Title";
import { assets, dashboardDummyData } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import PageTransition from "../../components/PageTransition";
import { motion } from "framer-motion";
const Dashboard = () => {
  const { currency, user, getToken, toast, axios } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    bookings: [],
    totalBookings: 0,
    totalRevenue: 0,
  });

  // Fetch dashboard data when component mounts
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const { data } = await axios.get("/api/bookings/hotel", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setDashboardData(data.dashBoardData);
      } else {
        toast.error(data.message || "Failed to fetch dashboard data");
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      let errorMessage = "Failed to fetch dashboard data";
      
      if (error?.response?.data?.message) {
        // Server responded with error status
        errorMessage = error.response.data.message;
      } else if (error?.response?.status) {
        errorMessage = `Server error: ${error.response.status}`;
      } else if (error?.request) {
        // Request was made but no response received
        errorMessage = "Network error: Could not connect to server";
      } else if (error?.message) {
        // Something else happened
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Simulate fetching data 
  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  return (
    <PageTransition>
      <div>
      <Title
        align="left"
        font="outfit"
        title="Dashboard"
        subTitle="Monitor your room listings, track bookings and analyze revenue—all in one place. Stay updated with real-time insights to ensure smooth operations."
      />

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">Loading dashboard data...</div>
        </div>
      ) : (
        <>
          <div className="flex gap-4 my-8">
            {/* ---- ---Total Bookings-- */}
            <motion.div 
              className="bg-primary/3 border border-primary/10 rounded flex p-4 pr-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            >
              <img
                src={assets.totalBookingIcon}
                alt=""
                className="max-sm:hidden h-10"
              />
              <div className="flex flex-col sm:ml-4 font-medium">
                <p className="text-blue-500 text-lg">Total Bookings</p>
                <p className="text-neutral-400 text-base">
                  {dashboardData.totalBookings}
                </p>
              </div>
            </motion.div>
            {/* ---- ---Total Revenue-- */}
            <motion.div 
              className="bg-primary/3 border border-primary/10 rounded flex p-4 pr-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            >
              <img
                src={assets.totalRevenueIcon}
                alt=""
                className="max-sm:hidden h-10"
              />
              <div className="flex flex-col sm:ml-4 font-medium">
                <p className="text-blue-500 text-lg">Total Revenue</p>
                <p className="text-neutral-400 text-base">
                  {currency} {dashboardData.totalRevenue}
                </p>
              </div>
            </motion.div>
          </div>

          {/* ------- Recent Bookings ---------- */}
          <h2 className="text-xl text-blue-950/70 font-medium mb-5">
            Recent Bookings
          </h2>

          <div className="w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-gray-800 font-medium">User Name</th>
                  <th className="py-3 px-4 text-gray-800 font-medium max-sm:hidden">
                    Room Name
                  </th>
                  <th className="py-3 px-4 text-gray-800 font-medium text-center">
                    Total Amount
                  </th>
                  <th className="py-3 px-4 text-gray-800 font-medium text-center">
                    Payment Status
                  </th>
                </tr>
              </thead>

              <tbody className="text-sm">
                {dashboardData.bookings && dashboardData.bookings.length > 0 ? (
                  dashboardData.bookings.map((item, index) => (
                    <tr key={index}>
                      <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                        {item.user?.username || 'N/A'}
                      </td>

                      <td className="py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden">
                        {item.room?.roomType || 'N/A'}
                      </td>

                      <td className="py-3 px-4 text-gray-700 border-t border-gray-300 text-center">
                        {currency} {item.totalPrice || 0}
                      </td>

                      <td className="py-3 px-4  border-t border-gray-300 flex">
                        <button
                          className={`py-1 px-3 text-xs rounded-full mx-auto ${
                            item.isPaid
                              ? "bg-green-200 text-green-600"
                              : "bg-amber-200 text-yellow-600"
                          }`}
                        >
                          {item.isPaid ? "Completed" : "Pending"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-8 px-4 text-center text-gray-500">
                      No bookings found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
      </div>
    </PageTransition>
  );
};

export default Dashboard;
