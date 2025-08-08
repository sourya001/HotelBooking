import React from "react";
import Navbar from "./components/Navbar";
import { useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import HotelReg from "./components/HotelReg";
import AnimatedRoutes from "./components/AnimatedRoutes";
import BackToTopButton from "./components/BackToTopButton";
import { Toaster } from "react-hot-toast";
import { useAppContext } from "./context/AppContext";
import { motion } from "framer-motion";
import { useSmoothScroll } from "./hooks/useSmoothScroll";

const App = () => {
  const location = useLocation();
  const isOwnerPath = location.pathname.includes("owner");
  const { showHotelReg } = useAppContext();

  // Enable smooth scrolling
  useSmoothScroll();

  const appVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div 
      variants={appVariants}
      initial="initial"
      animate="animate"
    >
      <Toaster />
      {!isOwnerPath && <Navbar />} {/* Show Navbar only if not on owner path */}
      {showHotelReg && <HotelReg />}
      <div className="min-h-[70vh]">
        <AnimatedRoutes />
      </div>
      <Footer />
      <BackToTopButton />
    </motion.div>
  );
};

export default App;
