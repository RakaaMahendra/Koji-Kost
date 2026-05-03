import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { setAuthToken } from "../services/api";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const userName = localStorage.getItem("name") || "";

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (token) setAuthToken(token);
    api
      .get("/bookings/my")
      .then((res) => setBookings(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status) => {
    const styles = {
      pending: "badge-pending",
      approved: "badge-approved",
      rejected: "badge-rejected",
    };
    return styles[status] || "badge-pending";
  };

  const getStatusIcon = (status) => {
    if (status === "approved") {
      return (
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
      );
    }
    if (status === "rejected") {
      return (
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
      );
    }
    return (
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
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    );
  };

  const filteredBookings =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  // Skeleton loader
  const SkeletonCard = () => (
    <div className="card p-6 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-20 h-20 bg-gray-200 rounded-xl"></div>
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 pb-12 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        {userName && (
          <p className="text-sm font-medium text-primary-600 mb-1">
            Halo, {userName}
          </p>
        )}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Booking Saya
        </h1>
        <p className="text-gray-500">
          Lihat dan kelola semua booking kost Anda
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">
            {bookings.length}
          </div>
          <div className="text-sm text-gray-500">Total Booking</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {bookings.filter((b) => b.status === "pending").length}
          </div>
          <div className="text-sm text-gray-500">Menunggu</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {bookings.filter((b) => b.status === "approved").length}
          </div>
          <div className="text-sm text-gray-500">Disetujui</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {bookings.filter((b) => b.status === "rejected").length}
          </div>
          <div className="text-sm text-gray-500">Ditolak</div>
        </div>
      </div>

      {/* Filters */}
      <div className="overflow-x-auto -mx-1 pb-1 mb-6">
        <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-xl w-fit min-w-max mx-1">
          {[
            { value: "all", label: "Semua" },
            { value: "pending", label: "Menunggu" },
            { value: "approved", label: "Disetujui" },
            { value: "rejected", label: "Ditolak" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === f.value
                  ? "bg-white text-primary-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div
              key={b._id}
              className="card p-6 hover:shadow-lg transition-shadow animate-fade-in"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Room Image */}
                <div className="w-full md:w-24 h-32 md:h-24 rounded-xl bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {b.room?.image ? (
                    <img
                      src={b.room.image}
                      alt={`Room ${b.room?.roomNumber}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-white">
                      <svg
                        className="w-8 h-8 mx-auto opacity-80"
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
                      <div className="text-sm font-medium mt-1">
                        {b.room?.roomNumber}
                      </div>
                    </div>
                  )}
                </div>

                {/* Booking Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Room {b.room?.roomNumber || "N/A"}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
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
                        <span>
                          {new Date(b.startDate).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}{" "}
                          -{" "}
                          {new Date(b.endDate).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
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
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="font-semibold text-gray-700">
                          Rp {b.room?.price?.toLocaleString("id-ID") || "0"}{" "}
                          /bulan
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`badge ${getStatusBadge(
                          b.status
                        )} flex items-center gap-1.5`}
                      >
                        {getStatusIcon(b.status)}
                        {b.status === "pending" && "Menunggu"}
                        {b.status === "approved" && "Disetujui"}
                        {b.status === "rejected" && "Ditolak"}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                    <Link
                      to={`/rooms/${b.room?._id}`}
                      className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      Lihat Kamar
                    </Link>
                    {b.status === "approved" && (
                      <a
                        href="https://wa.me/6281338059744"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-accent-600 hover:text-accent-700 flex items-center gap-1"
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
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        Hubungi Pemilik
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16">
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {filter === "all"
              ? "Belum ada booking"
              : `Tidak ada booking ${filter}`}
          </h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            {filter === "all"
              ? "Anda belum melakukan booking kamar. Mulai cari kamar impian Anda sekarang!"
              : "Tidak ada booking dengan status ini."}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium hover:shadow-lg hover:shadow-primary-500/30 transition-all"
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Cari Kamar
          </Link>
        </div>
      )}
    </div>
  );
}
