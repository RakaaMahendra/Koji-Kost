import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api, { setAuthToken } from "../services/api";

export default function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [booking, setBooking] = useState(false);

  // Feedback states
  const [fbName, setFbName] = useState("");
  const [fbMessage, setFbMessage] = useState("");
  const [fbLoading, setFbLoading] = useState(false);
  const [fbMsg, setFbMsg] = useState({ type: "", text: "" });

  const logged = !!localStorage.getItem("token");

  useEffect(() => {
    setLoading(true);
    api
      .get(`/rooms/${id}`)
      .then((res) => setRoom(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const book = async (e) => {
    e.preventDefault();
    if (!logged) {
      navigate("/login");
      return;
    }

    setBooking(true);
    try {
      const token = localStorage.getItem("token");
      if (token) setAuthToken(token);
      await api.post("/bookings", { roomId: id, startDate, endDate });
      setMsg({
        type: "success",
        text: "Booking berhasil dibuat! Menunggu persetujuan admin.",
      });
      setStartDate("");
      setEndDate("");
    } catch (err) {
      setMsg({
        type: "error",
        text:
          err.response?.data?.message || "Booking gagal. Silakan coba lagi.",
      });
    } finally {
      setBooking(false);
    }
  };

  const submitFeedback = async (e) => {
    e.preventDefault();
    setFbLoading(true);
    try {
      await api.post("/feedbacks", { name: fbName, message: fbMessage });
      setFbName("");
      setFbMessage("");
      setFbMsg({ type: "success", text: "Terima kasih! Feedback kamu sudah terkirim." });
    } catch (err) {
      setFbMsg({ type: "error", text: err.response?.data?.message || "Gagal mengirim feedback." });
    } finally {
      setFbLoading(false);
      setTimeout(() => setFbMsg({ type: "", text: "" }), 4000);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      available: "badge-available",
      occupied: "badge-occupied",
      maintenance: "badge-maintenance",
    };
    return styles[status] || "badge-available";
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
        <div className="h-80 bg-gray-200 rounded-2xl mb-6"></div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="h-64 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Kamar tidak ditemukan
        </h3>
        <Link
          to="/"
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Kembali ke daftar kamar
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary-600 transition-colors">
          Rooms
        </Link>
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
            d="M9 5l7 7-7 7"
          />
        </svg>
        <span className="text-gray-900 font-medium">
          Room {room.roomNumber}
        </span>
      </nav>

      {/* Room Image Gallery */}
      <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden mb-8 group">
        {room.image ? (
          <img
            src={room.image}
            alt={`Room ${room.roomNumber}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-400 via-primary-500 to-primary-700 flex items-center justify-center">
            <div className="text-center text-white">
              <svg
                className="w-20 h-20 mx-auto mb-4 opacity-80"
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
              <div className="text-3xl font-bold">Room {room.roomNumber}</div>
            </div>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span
            className={`badge ${getStatusBadge(room.status)} px-4 py-2 text-sm`}
          >
            {room.status === "available" && (
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            )}
            {room.status}
          </span>
        </div>

        {/* Favorite Button */}
        <button className="absolute top-4 left-4 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-lg">
          <svg
            className="w-6 h-6 text-gray-600 hover:text-red-500 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          {/* Header */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Kost Room {room.roomNumber}
                </h1>
                <p className="text-gray-500 mt-1 flex items-center gap-2">
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
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Koji Kost Residence
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl md:text-3xl font-bold text-primary-600">
                  Rp {room.price?.toLocaleString("id-ID")}
                </div>
                <div className="text-gray-500">/bulan</div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap items-center gap-4 mt-6">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-50">
                <svg
                  className="w-5 h-5 text-yellow-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-semibold text-yellow-700">4.8</span>
                <span className="text-yellow-600 text-sm">(24 reviews)</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm">Response dalam 1 jam</span>
              </div>
            </div>
          </div>

          {/* Facilities */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              Fasilitas Kamar
            </h2>

            {room.facilities && room.facilities.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {room.facilities.map((facility, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-primary-600"
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
                    <span className="text-sm font-medium text-gray-700">
                      {facility}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                Belum ada fasilitas yang ditambahkan.
              </p>
            )}
          </div>

          {/* Description */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Deskripsi
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Kamar kost nyaman dengan fasilitas lengkap. Cocok untuk mahasiswa
              atau pekerja yang mencari hunian praktis dengan akses mudah ke
              berbagai fasilitas umum. Lingkungan aman dan tenang, tersedia
              parkir kendaraan.
            </p>
          </div>

          {/* Rules */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              Peraturan Kost
            </h2>
            <ul className="space-y-3">
              {[
                "Tamu menginap maks 22.00",
                "Tidak boleh membawa hewan peliharaan",
                "Menjaga kebersihan dan ketenangan",
                "Pembayaran dilakukan di awal bulan",
              ].map((rule, idx) => (
                <li key={idx} className="flex items-start gap-3 text-gray-600">
                  <svg
                    className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {rule}
                </li>
              ))}
            </ul>
          </div>
          {/* Feedback Form */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Kirim Feedback
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Bagikan pengalaman atau saran kamu tentang kamar ini.
            </p>
            {fbMsg.text && (
              <div
                className={`mb-4 p-3 rounded-xl text-sm font-medium ${
                  fbMsg.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {fbMsg.text}
              </div>
            )}
            <form onSubmit={submitFeedback} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama
                </label>
                <input
                  value={fbName}
                  onChange={(e) => setFbName(e.target.value)}
                  placeholder="Nama kamu"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pesan / Review
                </label>
                <textarea
                  value={fbMessage}
                  onChange={(e) => setFbMessage(e.target.value)}
                  placeholder="Tulis feedback atau review kamu di sini..."
                  required
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={fbLoading}
                className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  fbLoading
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:shadow-lg hover:shadow-primary-500/30"
                }`}
              >
                {fbLoading ? "Mengirim..." : "Kirim Feedback"}
              </button>
            </form>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="md:col-span-1">
          <div className="card p-6 sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Booking Kamar Ini
            </h3>

            {/* Message */}
            {msg.text && (
              <div
                className={`mb-4 p-4 rounded-xl ${
                  msg.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  {msg.type === "success" ? (
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
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
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                  <span className="text-sm font-medium">{msg.text}</span>
                </div>
              </div>
            )}

            {room.status === "available" ? (
              <form onSubmit={book} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Mulai
                  </label>
                  <div className="relative">
                    <svg
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Selesai
                  </label>
                  <div className="relative">
                    <svg
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-600">Total per bulan</span>
                    <span className="text-xl font-bold text-gray-900">
                      Rp {room.price?.toLocaleString("id-ID")}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={booking}
                    className={`w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                      booking
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:shadow-lg hover:shadow-primary-500/30"
                    }`}
                  >
                    {booking ? (
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
                        Processing...
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
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        Book Sekarang
                      </>
                    )}
                  </button>
                </div>

                {!logged && (
                  <p className="text-center text-sm text-gray-500">
                    <Link
                      to="/login"
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Login
                    </Link>{" "}
                    untuk melakukan booking
                  </p>
                )}
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 mb-4">
                  Kamar ini sedang tidak tersedia
                </p>
                <Link
                  to="/"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Lihat kamar lainnya
                </Link>
              </div>
            )}

            {/* Contact Owner */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <button className="w-full py-3 rounded-xl border-2 border-accent-500 text-accent-600 font-semibold hover:bg-accent-50 transition-colors flex items-center justify-center gap-2">
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
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                Hubungi Pemilik
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
