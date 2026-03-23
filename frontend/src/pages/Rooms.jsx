import React, { useEffect, useState } from "react";
import api from "../services/api";
import RoomListItem from "../components/RoomListItem";
import RoomCard from "../components/RoomCard";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [viewMode, setViewMode] = useState("list"); // list or grid
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    setLoading(true);
    api
      .get("/rooms")
      .then((res) => setRooms(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Filter logic
  const qTrimmed = q.trim().toLowerCase();
  const filtered = rooms.filter((r) => {
    const matchesSearch =
      !qTrimmed ||
      r.roomNumber?.toString().toLowerCase().includes(qTrimmed) ||
      r.facilities?.join(" ").toLowerCase().includes(qTrimmed);
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Skeleton loader component
  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl p-4 animate-pulse">
      <div className="h-32 bg-gray-200 rounded-xl mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );

  return (
    <div className="page-rooms min-h-screen pb-12">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-2xl mb-8 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-primary-300/10 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-sm mb-4">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                {rooms.filter((r) => r.status === "available").length} Kamar
                Tersedia
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4">
                Temukan Kost Impian Anda
              </h1>
              <p className="text-lg text-white/80 max-w-xl">
                Cari kost nyaman dengan fasilitas lengkap sesuai kebutuhan Anda.
                Proses booking mudah dan cepat.
              </p>
            </div>

            {/* Search Box */}
            <div className="w-full md:w-auto md:min-w-[400px]">
              <form
                onSubmit={(e) => e.preventDefault()}
                className="bg-white rounded-2xl p-2 shadow-2xl shadow-black/20"
              >
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <svg
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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
                    <input
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      placeholder="Cari kamar atau fasilitas..."
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-primary-400 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-accent-500 to-accent-600 text-white px-6 py-4 rounded-xl font-medium hover:shadow-lg hover:shadow-accent-500/30 transition-all flex items-center gap-2"
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
                    <span className="hidden sm:inline">Cari</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4">
        {/* Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filters */}
            <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-xl">
              {[
                { value: "all", label: "Semua" },
                { value: "available", label: "Tersedia" },
                { value: "occupied", label: "Terisi" },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setStatusFilter(filter.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    statusFilter === filter.value
                      ? "bg-white text-primary-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "list"
                  ? "bg-white shadow-sm text-primary-600"
                  : "text-gray-500"
              }`}
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
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "grid"
                  ? "bg-white shadow-sm text-primary-600"
                  : "text-gray-500"
              }`}
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
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">
              {filtered.length}
            </span>{" "}
            kamar ditemukan
          </p>
        </div>

        {/* Main Content */}
        <div className="md:flex md:gap-8">
          {/* Room List */}
          <div className={viewMode === "list" ? "md:w-2/5" : "w-full"}>
            {loading ? (
              <div
                className={
                  viewMode === "list"
                    ? "space-y-4"
                    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                }
              >
                {[1, 2, 3, 4].map((i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : (
              (() => {
                const floor1 = filtered.filter((r) => (r.floor || 1) === 1);
                const floor2 = filtered.filter((r) => r.floor === 2);
                const hasFloors = floor1.length > 0 || floor2.length > 0;

                if (!hasFloors) return null;

                const renderRooms = (list) =>
                  viewMode === "list" ? (
                    <div className="space-y-4">
                      {list.map((r) => (
                        <RoomListItem key={r._id} room={r} />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {list.map((r) => (
                        <RoomCard key={r._id} room={r} />
                      ))}
                    </div>
                  );

                return (
                  <div className="space-y-8">
                    {floor1.length > 0 && (
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                            <span className="text-primary-600 font-bold text-sm">
                              1
                            </span>
                          </div>
                          <h2 className="text-lg font-bold text-gray-900">
                            Lantai 1
                          </h2>
                          <span className="text-sm text-gray-400">
                            ({floor1.length} kamar)
                          </span>
                        </div>
                        {renderRooms(floor1)}
                      </div>
                    )}
                    {floor2.length > 0 && (
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                            <span className="text-primary-600 font-bold text-sm">
                              2
                            </span>
                          </div>
                          <h2 className="text-lg font-bold text-gray-900">
                            Lantai 2
                          </h2>
                          <span className="text-sm text-gray-400">
                            ({floor2.length} kamar)
                          </span>
                        </div>
                        {renderRooms(floor2)}
                      </div>
                    )}
                  </div>
                );
              })()
            )}

            {/* Empty State */}
            {!loading && filtered.length === 0 && (
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
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Tidak ada hasil
                </h3>
                <p className="text-gray-500 mb-6">
                  Coba ubah filter atau kata kunci pencarian Anda
                </p>
                <button
                  onClick={() => {
                    setQ("");
                    setStatusFilter("all");
                  }}
                  className="px-6 py-2.5 rounded-xl bg-primary-50 text-primary-600 font-medium hover:bg-primary-100 transition-colors"
                >
                  Reset Filter
                </button>
              </div>
            )}
          </div>

          {/* Room Photo Gallery - Only show in list view */}
          {viewMode === "list" && (
            <div className="hidden md:block md:w-3/5 mt-6 md:mt-0">
              <div className="sticky top-24">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-700">
                    Galeri Foto Kamar
                  </h3>
                  <span className="text-xs text-gray-400">
                    Foto representatif
                  </span>
                </div>
                <div className="grid grid-cols-3 grid-rows-3 gap-2 h-[72vh] rounded-2xl overflow-hidden">
                  {/* Large main photo */}
                  <div className="col-span-2 row-span-2 overflow-hidden rounded-xl">
                    <img
                      src="https://picsum.photos/seed/koji-room-main/800/600"
                      alt="Kamar Kost 1"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  {/* Small top-right */}
                  <div className="overflow-hidden rounded-xl">
                    <img
                      src="https://picsum.photos/seed/koji-room-2/400/300"
                      alt="Kamar Kost 2"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  {/* Small middle-right */}
                  <div className="overflow-hidden rounded-xl">
                    <img
                      src="https://picsum.photos/seed/koji-room-3/400/300"
                      alt="Kamar Kost 3"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  {/* Bottom row - 3 photos */}
                  <div className="overflow-hidden rounded-xl">
                    <img
                      src="https://picsum.photos/seed/koji-room-4/400/300"
                      alt="Kamar Kost 4"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="overflow-hidden rounded-xl">
                    <img
                      src="https://picsum.photos/seed/koji-room-5/400/300"
                      alt="Kamar Kost 5"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="overflow-hidden rounded-xl relative">
                    <img
                      src="https://picsum.photos/seed/koji-room-6/400/300"
                      alt="Kamar Kost 6"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        Lihat Semua
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
