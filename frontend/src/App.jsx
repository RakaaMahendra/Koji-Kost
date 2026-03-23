import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Rooms from "./pages/Rooms";
import RoomDetail from "./pages/RoomDetail";
import MyBookings from "./pages/MyBookings";
import AdminDashboard from "./pages/AdminDashboard";

const Private = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

const AdminOnly = ({ children }) => {
  const role = localStorage.getItem("role");
  return role === "admin" ? children : <Navigate to="/" />;
};

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Rooms />} />
          <Route path="/rooms/:id" element={<RoomDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/bookings"
            element={
              <Private>
                <MyBookings />
              </Private>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminOnly>
                <AdminDashboard />
              </AdminOnly>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
