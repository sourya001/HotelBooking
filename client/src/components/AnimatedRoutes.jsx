import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "../pages/Home";
import AllRooms from "../pages/AllRooms";
import RoomDetails from "../pages/RoomDetails";
import MyBookings from "../pages/MyBookings";
import Layout from "../pages/hotelOwner/Layout";
import Dashboard from "../pages/hotelOwner/Dashboard";
import AddRoom from "../pages/hotelOwner/AddRoom";
import ListRoom from "../pages/hotelOwner/ListRoom";
import Loader from "./Loader";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<AllRooms />} />
        <Route path="/rooms/:id" element={<RoomDetails />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/loader/:nextUrl" element={<Loader />} />
        <Route path="/owner" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-room" element={<AddRoom />} />
          <Route path="list-room" element={<ListRoom />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
