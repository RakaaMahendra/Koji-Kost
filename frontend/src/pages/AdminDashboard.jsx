import React, { useEffect, useState } from "react";
import api, { setAuthToken } from "../services/api";

export default function AdminDashboard() {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Form states
  const [roomNumber, setRoomNumber] = useState("");
  const [price, setPrice] = useState("");
  const [facilities, setFacilities] = useState("");
  const [floor, setFloor] = useState(1);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "", message: "" });

  // Edit states
  const [editingRoom, setEditingRoom] = useState(null);
  const [editRoomNumber, setEditRoomNumber] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editFacilities, setEditFacilities] = useState("");
  const [editFloor, setEditFloor] = useState(1);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuthToken(token);
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [roomsRes, bookingsRes, feedbacksRes, usersRes] = await Promise.all(
        [
          api.get("/rooms"),
          api.get("/bookings"),
          api.get("/feedbacks"),
          api.get("/auth/users"),
        ]
      );
      setRooms(Array.isArray(roomsRes.data) ? roomsRes.data : []);
      setBookings(Array.isArray(bookingsRes.data) ? bookingsRes.data : []);
      setFeedbacks(Array.isArray(feedbacksRes.data) ? feedbacksRes.data : []);
      setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "", message: "" }), 3000);
  };

  const createRoom = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await api.post("/rooms", {
        roomNumber,
        price: Number(price),
        floor: Number(floor),
        facilities: facilities
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean),
      });
      setRoomNumber("");
      setPrice("");
      setFacilities("");
      setFloor(1);
      setShowRoomForm(false);
      await loadData();
      showToast("success", "Kamar berhasil ditambahkan!");
    } catch (err) {
      showToast(
        "error",
        err.response?.data?.message || "Gagal menambahkan kamar"
      );
    } finally {
      setFormLoading(false);
    }
  };

  const deleteRoom = async (id) => {
    if (!confirm("Yakin ingin menghapus kamar ini?")) return;
    try {
      await api.delete(`/rooms/${id}`);
      await loadData();
      showToast("success", "Kamar berhasil dihapus!");
    } catch (err) {
      showToast("error", "Gagal menghapus kamar");
    }
  };

  const updateRoomStatus = async (id, status) => {
    try {
      await api.patch(`/rooms/${id}/status`, { status });
      await loadData();
      showToast("success", `Status kamar berhasil diubah ke ${status}!`);
    } catch (err) {
      showToast("error", "Gagal mengubah status kamar");
    }
  };

  const openEditRoom = (r) => {
    setEditingRoom(r);
    setEditRoomNumber(r.roomNumber);
    setEditPrice(r.price);
    setEditFacilities((r.facilities || []).join(", "));
    setEditFloor(r.floor || 1);
  };

  const saveEditRoom = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      await api.put(`/rooms/${editingRoom._id}`, {
        roomNumber: editRoomNumber,
        price: Number(editPrice),
        floor: Number(editFloor),
        facilities: editFacilities
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean),
      });
      setEditingRoom(null);
      await loadData();
      showToast("success", "Kamar berhasil diperbarui!");
    } catch (err) {
      showToast(
        "error",
        err.response?.data?.message || "Gagal memperbarui kamar"
      );
    } finally {
      setEditLoading(false);
    }
  };

  const updateBooking = async (id, status) => {
    try {
      await api.patch(`/bookings/${id}/status`, { status });
      await loadData();
      showToast(
        "success",
        `Booking berhasil ${status === "approved" ? "disetujui" : "ditolak"}!`
      );
    } catch (err) {
      showToast("error", "Gagal mengupdate status booking");
    }
  };

  const deleteBooking = async (id) => {
    if (!confirm("Yakin ingin menghapus booking ini?")) return;
    try {
      await api.delete(`/bookings/${id}`);
      await loadData();
      showToast("success", "Booking berhasil dihapus!");
    } catch (err) {
      showToast("error", "Gagal menghapus booking");
    }
  };

  const deleteUser = async (id) => {
    if (
      !confirm(
        "Yakin ingin menghapus akun user ini? Semua booking-nya juga akan dihapus."
      )
    )
      return;
    try {
      await api.delete(`/auth/users/${id}`);
      await loadData();
      showToast("success", "Akun user berhasil dihapus!");
    } catch (err) {
      showToast("error", err.response?.data?.message || "Gagal menghapus user");
    }
  };

  const deleteFeedback = async (id) => {
    if (!confirm("Yakin ingin menghapus feedback ini?")) return;
    try {
      await api.delete(`/feedbacks/${id}`);
      setFeedbacks((prev) => prev.filter((f) => f._id !== id));
      showToast("success", "Feedback berhasil dihapus!");
    } catch (err) {
      showToast("error", "Gagal menghapus feedback");
    }
  };

  const toggleFeedbackDone = async (id) => {
    try {
      const res = await api.patch(`/feedbacks/${id}/done`);
      setFeedbacks((prev) =>
        prev.map((f) => (f._id === id ? { ...f, done: res.data.done } : f))
      );
    } catch (err) {
      showToast("error", "Gagal mengubah status feedback");
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      available: "badge-available",
      occupied: "badge-occupied",
      maintenance: "badge-maintenance",
      pending: "badge-pending",
      approved: "badge-approved",
      rejected: "badge-rejected",
    };
    return styles[status] || "badge-pending";
  };

  // Stats
  const stats = {
    totalRooms: rooms.length,
    availableRooms: rooms.filter((r) => r.status === "available").length,
    totalBookings: bookings.length,
    pendingBookings: bookings.filter((b) => b.status === "pending").length,
    totalRevenue: rooms
      .filter((r) => r.status === "occupied")
      .reduce((sum, r) => sum + (r.price || 0), 0),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pb-12 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-500">Kelola kamar dan booking kost Anda</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalRooms}
              </div>
              <div className="text-sm text-gray-500">Total Kamar</div>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.availableRooms}
              </div>
              <div className="text-sm text-gray-500">Tersedia</div>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalBookings}
              </div>
              <div className="text-sm text-gray-500">Total Booking</div>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.pendingBookings}
              </div>
              <div className="text-sm text-gray-500">Pending</div>
            </div>
          </div>
        </div>

        <div className="card p-5 col-span-2 md:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-accent-100 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-accent-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                Rp {stats.totalRevenue.toLocaleString("id-ID")}
              </div>
              <div className="text-sm text-gray-500">Pendapatan/bln</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="overflow-x-auto mb-6 -mx-1 pb-1">
        <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-xl w-fit min-w-max mx-1">
          {[
            {
              value: "overview",
              label: "Overview",
              icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z",
            },
            {
              value: "rooms",
              label: "Kamar",
              icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
            },
            {
              value: "bookings",
              label: "Booking",
              icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
            },
            {
              value: "users",
              label: "Users",
              icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
            },
            {
              value: "feedback",
              label: "Feedback",
              icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
            },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.value
                  ? "bg-white text-primary-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={tab.icon}
                />
              </svg>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Bookings */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">
                    Booking Terbaru
                  </h2>
                  <button
                    onClick={() => setActiveTab("bookings")}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Lihat Semua
                  </button>
                </div>
                <div className="space-y-3">
                  {bookings.slice(0, 5).map((b) => (
                    <div
                      key={b._id}
                      className="flex items-center justify-between p-3 rounded-xl bg-gray-50"
                    >
                      <div>
                        <div className="font-medium text-gray-900">
                          {b.user?.name || "User"}
                        </div>
                        <div className="text-sm text-gray-500">
                          Room {b.room?.roomNumber}
                        </div>
                      </div>
                      <span className={`badge ${getStatusBadge(b.status)}`}>
                        {b.status}
                      </span>
                    </div>
                  ))}
                  {bookings.length === 0 && (
                    <p className="text-center text-gray-500 py-4">
                      Belum ada booking
                    </p>
                  )}
                </div>
              </div>

              {/* Room Status */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">
                    Status Kamar
                  </h2>
                  <button
                    onClick={() => setActiveTab("rooms")}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Kelola
                  </button>
                </div>
                <div className="space-y-3">
                  {rooms.slice(0, 5).map((r) => (
                    <div
                      key={r._id}
                      className="flex items-center justify-between p-3 rounded-xl bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm">
                          {r.roomNumber}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            Room {r.roomNumber}
                          </div>
                          <div className="text-sm text-gray-500">
                            Rp {r.price?.toLocaleString("id-ID")}
                          </div>
                        </div>
                      </div>
                      <span className={`badge ${getStatusBadge(r.status)}`}>
                        {r.status}
                      </span>
                    </div>
                  ))}
                  {rooms.length === 0 && (
                    <p className="text-center text-gray-500 py-4">
                      Belum ada kamar
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Rooms Tab */}
          {activeTab === "rooms" && (
            <div>
              {/* Add Room Button */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setShowRoomForm(!showRoomForm)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium hover:shadow-lg hover:shadow-primary-500/30 transition-all"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={
                        showRoomForm ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"
                      }
                    />
                  </svg>
                  {showRoomForm ? "Batal" : "Tambah Kamar"}
                </button>
              </div>

              {/* Add Room Form */}
              {showRoomForm && (
                <div className="card p-6 mb-6 animate-slide-down">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Tambah Kamar Baru
                  </h3>
                  <form
                    onSubmit={createRoom}
                    className="grid md:grid-cols-3 gap-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nomor Kamar
                      </label>
                      <input
                        value={roomNumber}
                        onChange={(e) => setRoomNumber(e.target.value)}
                        placeholder="101"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Harga /bulan
                      </label>
                      <input
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="1500000"
                        type="number"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lantai
                      </label>
                      <select
                        value={floor}
                        onChange={(e) => setFloor(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                      >
                        <option value={1}>Lantai 1</option>
                        <option value={2}>Lantai 2</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fasilitas (pisah koma)
                      </label>
                      <input
                        value={facilities}
                        onChange={(e) => setFacilities(e.target.value)}
                        placeholder="AC, WiFi, Kamar Mandi Dalam"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <button
                        type="submit"
                        disabled={formLoading}
                        className={`w-full md:w-auto px-8 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                          formLoading
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:shadow-lg hover:shadow-accent-500/30"
                        }`}
                      >
                        {formLoading ? (
                          <>
                            <svg
                              className="animate-spin w-5 h-5"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Menyimpan...
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Simpan Kamar
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Rooms Table */}
              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Kamar
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Lantai
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Harga
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Fasilitas
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {rooms.map((r) => (
                        <tr
                          key={r._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm">
                                {r.roomNumber}
                              </div>
                              <span className="font-medium text-gray-900">
                                Room {r.roomNumber}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 rounded-lg bg-blue-50 text-blue-600 text-sm font-medium">
                              Lantai {r.floor || 1}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-semibold text-gray-900">
                              Rp {r.price?.toLocaleString("id-ID")}
                            </span>
                            <span className="text-gray-500 text-sm">/bln</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {(r.facilities || []).slice(0, 3).map((f, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-1 rounded-lg bg-gray-100 text-xs text-gray-600"
                                >
                                  {f}
                                </span>
                              ))}
                              {(r.facilities || []).length > 3 && (
                                <span className="px-2 py-1 rounded-lg bg-gray-100 text-xs text-gray-500">
                                  +{r.facilities.length - 3}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`badge ${getStatusBadge(r.status)}`}
                            >
                              {r.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <select
                                value={r.status}
                                onChange={(e) =>
                                  updateRoomStatus(r._id, e.target.value)
                                }
                                className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 cursor-pointer hover:border-primary-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-100 transition-all"
                                title="Ubah Status"
                              >
                                <option value="available">Available</option>
                                <option value="occupied">Occupied</option>
                                <option value="maintenance">Maintenance</option>
                              </select>
                              <button
                                onClick={() => openEditRoom(r)}
                                className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"
                                title="Edit"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={() => deleteRoom(r._id)}
                                className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                title="Hapus"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {rooms.length === 0 && (
                  <div className="text-center py-12">
                    <svg
                      className="w-12 h-12 mx-auto text-gray-400 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    <p className="text-gray-500">
                      Belum ada kamar. Tambahkan kamar pertama Anda!
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === "bookings" && (
            <div className="space-y-4">
              {bookings.length > 0 ? (
                bookings.map((b) => (
                  <div key={b._id} className="card p-6 animate-fade-in">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        {/* User Avatar */}
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                          {b.user?.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">
                            {b.user?.name || "Unknown User"}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {b.user?.email || ""}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                              </svg>
                              Room {b.room?.roomNumber}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              {new Date(b.startDate).toLocaleDateString(
                                "id-ID"
                              )}{" "}
                              -{" "}
                              {new Date(b.endDate).toLocaleDateString("id-ID")}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`badge ${getStatusBadge(b.status)}`}>
                          {b.status === "pending" && "Menunggu"}
                          {b.status === "approved" && "Disetujui"}
                          {b.status === "rejected" && "Ditolak"}
                        </span>

                        {b.status === "pending" && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateBooking(b._id, "approved")}
                              className="flex items-center gap-1 px-4 py-2 rounded-lg bg-gradient-to-r from-accent-500 to-accent-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-accent-500/30 transition-all"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              Setujui
                            </button>
                            <button
                              onClick={() => updateBooking(b._id, "rejected")}
                              className="flex items-center gap-1 px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                              Tolak
                            </button>
                          </div>
                        )}
                        <button
                          onClick={() => deleteBooking(b._id)}
                          className="p-2 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                          title="Hapus Booking"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16">
                  <svg
                    className="w-12 h-12 mx-auto text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-gray-500">Belum ada booking</p>
                </div>
              )}
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="card overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Daftar User</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Semua akun pengguna terdaftar
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Kamar Saat Ini
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Bergabung
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((u) => {
                      const activeBooking = bookings.find(
                        (b) =>
                          b.user?._id === u._id &&
                          b.status === "approved" &&
                          new Date(b.endDate) >= new Date()
                      );
                      return (
                        <tr
                          key={u._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm">
                                {u.name?.charAt(0).toUpperCase() || "U"}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">
                                  {u.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {u.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {activeBooking ? (
                              <span className="font-medium text-gray-900">
                                Room {activeBooking.room?.roomNumber}
                                {activeBooking.room?.floor && (
                                  <span className="ml-1 text-xs text-gray-500">
                                    (Lantai {activeBooking.room.floor})
                                  </span>
                                )}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-sm">
                                Tidak menghuni
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(u.createdAt).toLocaleDateString("id-ID")}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => deleteUser(u._id)}
                              className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                              title="Hapus Akun"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {users.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  Belum ada user terdaftar
                </div>
              )}
            </div>
          )}

          {/* Feedback Tab */}
          {activeTab === "feedback" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">
                  Feedback dari Pengguna
                </h2>
                <span className="text-sm text-gray-500">
                  {feedbacks.length} feedback masuk
                </span>
              </div>
              {feedbacks.length > 0 ? (
                <div className="grid gap-4">
                  {feedbacks.map((fb) => (
                    <div
                      key={fb._id}
                      className={`card p-5 animate-fade-in transition-all ${
                        fb.done ? "opacity-60 bg-green-50" : ""
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                          {fb.name?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900">
                                {fb.name}
                              </span>
                              {fb.done && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                                  <svg
                                    className="w-3 h-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                  Selesai
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-xs text-gray-400">
                                {new Date(fb.createdAt).toLocaleDateString(
                                  "id-ID",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </span>
                              <button
                                onClick={() => toggleFeedbackDone(fb._id)}
                                className={`p-1.5 rounded-lg transition-colors ${
                                  fb.done
                                    ? "text-green-600 bg-green-100 hover:bg-green-200"
                                    : "text-gray-400 hover:bg-gray-100 hover:text-green-600"
                                }`}
                                title={
                                  fb.done
                                    ? "Tandai belum selesai"
                                    : "Tandai selesai"
                                }
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={() => deleteFeedback(fb._id)}
                                className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                                title="Hapus feedback"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                          <p className="text-gray-600 mt-1 text-sm leading-relaxed">
                            {fb.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <svg
                    className="w-12 h-12 mx-auto text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <p className="text-gray-500">Belum ada feedback masuk</p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Edit Room Modal */}
      {editingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900">Edit Kamar</h3>
              <button
                onClick={() => setEditingRoom(null)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={saveEditRoom} className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Kamar
                </label>
                <input
                  value={editRoomNumber}
                  onChange={(e) => setEditRoomNumber(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Harga /bulan
                </label>
                <input
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  type="number"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lantai
                </label>
                <select
                  value={editFloor}
                  onChange={(e) => setEditFloor(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                >
                  <option value={1}>Lantai 1</option>
                  <option value={2}>Lantai 2</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fasilitas (pisah koma)
                </label>
                <input
                  value={editFacilities}
                  onChange={(e) => setEditFacilities(e.target.value)}
                  placeholder="AC, WiFi, Kamar Mandi Dalam"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                />
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setEditingRoom(null)}
                  className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    editLoading
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:shadow-lg hover:shadow-primary-500/30"
                  }`}
                >
                  {editLoading ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`toast ${
            toast.type === "success" ? "toast-success" : "toast-error"
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === "success" ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}
