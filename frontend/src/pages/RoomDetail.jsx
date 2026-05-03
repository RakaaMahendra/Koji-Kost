import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api, { setAuthToken } from "../services/api";

// Room photo gallery data — foto asli Koji Kost (taruh file di frontend/public/)
const ROOM_PHOTOS = [
  {
    src: "/kamar-tidur.jpeg",
    label: "🛏️ Ruang Tidur",
    alt: "Ruang Tidur Koji Kost",
  },
  {
    src: "/kamar-mandi.jpeg",
    label: "🚿 Kamar Mandi",
    alt: "Kamar Mandi Koji Kost",
  },
  {
    src: "/dapur.jpeg",
    label: "🍳 Dapur",
    alt: "Dapur Koji Kost",
  },
  {
    src: "/lantai1-area.png",
    label: "🏠 Area Lantai 1",
    alt: "Area Lantai 1 Koji Kost",
  },
  {
    src: "/lantai2-area.png",
    label: "🏢 Area Lantai 2",
    alt: "Area Lantai 2 Koji Kost",
  },
  {
    src: "/lantai2-area1.png",
    label: "🏢 Area Lantai 2 (2)",
    alt: "Area Lantai 2 Koji Kost (2)",
  },
];

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

  // Lightbox state
  const [lightbox, setLightbox] = useState({ open: false, idx: 0 });
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  const openLightbox = (idx) => {
    setLightbox({ open: true, idx });
    setZoom(1);
    setTranslate({ x: 0, y: 0 });
  };
  const closeLightbox = () => {
    setLightbox({ open: false, idx: 0 });
    setZoom(1);
    setTranslate({ x: 0, y: 0 });
  };
  const prevPhoto = () => {
    setLightbox((prev) => ({
      ...prev,
      idx: (prev.idx - 1 + ROOM_PHOTOS.length) % ROOM_PHOTOS.length,
    }));
    setZoom(1);
    setTranslate({ x: 0, y: 0 });
  };
  const nextPhoto = () => {
    setLightbox((prev) => ({
      ...prev,
      idx: (prev.idx + 1) % ROOM_PHOTOS.length,
    }));
    setZoom(1);
    setTranslate({ x: 0, y: 0 });
  };
  const handleWheel = (e) => {
    e.preventDefault();
    setZoom((z) => Math.min(4, Math.max(1, z - e.deltaY * 0.005)));
  };
  const handleMouseDown = (e) => {
    if (zoom <= 1) return;
    setDragging(true);
    setDragStart({ x: e.clientX - translate.x, y: e.clientY - translate.y });
  };
  const handleMouseMove = (e) => {
    if (!dragging) return;
    setTranslate({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const handleMouseUp = () => setDragging(false);

  // Touch support for lightbox (swipe + pinch-to-zoom)
  const [touchStart, setTouchStart] = useState(null);
  const [pinchStart, setPinchStart] = useState(null);

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[1].clientX - e.touches[0].clientX,
        e.touches[1].clientY - e.touches[0].clientY
      );
      setPinchStart({ dist, zoom });
    } else {
      setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && pinchStart) {
      e.preventDefault();
      const dist = Math.hypot(
        e.touches[1].clientX - e.touches[0].clientX,
        e.touches[1].clientY - e.touches[0].clientY
      );
      setZoom(
        Math.min(4, Math.max(1, pinchStart.zoom * (dist / pinchStart.dist)))
      );
    }
  };

  const handleTouchEnd = (e) => {
    if (pinchStart) {
      setPinchStart(null);
      return;
    }
    if (!touchStart) return;
    const dx = e.changedTouches[0].clientX - touchStart.x;
    const dy = e.changedTouches[0].clientY - touchStart.y;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      dx < 0 ? nextPhoto() : prevPhoto();
    }
    setTouchStart(null);
  };

  useEffect(() => {
    if (!lightbox.open) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevPhoto();
      if (e.key === "ArrowRight") nextPhoto();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox.open, lightbox.idx]);

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
      setFbMsg({
        type: "success",
        text: "Terima kasih! Feedback kamu sudah terkirim.",
      });
    } catch (err) {
      setFbMsg({
        type: "error",
        text: err.response?.data?.message || "Gagal mengirim feedback.",
      });
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
      <div className="max-w-5xl mx-auto px-4 animate-pulse">
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
    <div className="max-w-6xl mx-auto px-4 pb-16 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-5 pt-2">
        <Link
          to="/"
          className="hover:text-primary-600 transition-colors font-medium"
        >
          Semua Kamar
        </Link>
        <svg
          className="w-3.5 h-3.5"
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
        <span className="text-gray-700 font-semibold">
          Kamar {room.roomNumber}
        </span>
      </nav>

      {/* ── HERO HEADER ── */}
      <div className="mb-2">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`badge ${getStatusBadge(
                  room.status
                )} text-xs px-2.5 py-0.5 font-semibold flex items-center gap-1`}
              >
                {room.status === "available" && (
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block"></span>
                )}
                {room.status === "available"
                  ? "Tersedia"
                  : room.status === "occupied"
                  ? "Terisi"
                  : "Maintenance"}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <svg
                  className="w-3.5 h-3.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-semibold text-yellow-600">4.8</span>
                <span className="text-gray-400">· 24 ulasan</span>
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Kamar {room.roomNumber} — Koji Kost
            </h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
              <svg
                className="w-4 h-4 text-gray-400"
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
              Koji Kost Residence, Indonesia
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400 mb-0.5">Mulai dari</div>
            <div className="text-2xl font-extrabold text-gray-900">
              Rp {room.price?.toLocaleString("id-ID")}
            </div>
            <div className="text-xs text-gray-400">/bulan</div>
          </div>
        </div>
      </div>

      {/* ── PHOTO MOSAIC ── */}
      <div className="relative rounded-2xl overflow-hidden mb-8 h-[280px] md:h-[480px] md:grid md:grid-cols-2 md:grid-rows-2 md:gap-2">
        {/* Main large photo */}
        <div
          className="relative md:col-span-1 md:row-span-2 h-full cursor-zoom-in group"
          onClick={() => openLightbox(0)}
        >
          <img
            src={ROOM_PHOTOS[0].src}
            alt={ROOM_PHOTOS[0].alt}
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover object-center group-hover:brightness-90 transition-all duration-300"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-lg">
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"
                />
              </svg>
            </div>
          </div>
          {/* "Lihat semua foto" button — visible on mobile only */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              openLightbox(0);
            }}
            className="md:hidden absolute bottom-3 right-3 flex items-center gap-2 bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md border border-gray-200"
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
                d="M4 6h16M4 10h16M4 14h8"
              />
            </svg>
            Lihat semua foto
          </button>
        </div>

        {/* Top-right photo */}
        <div
          className="relative hidden md:block cursor-zoom-in group"
          onClick={() => openLightbox(1)}
        >
          <img
            src={ROOM_PHOTOS[1]?.src || ROOM_PHOTOS[0].src}
            alt={ROOM_PHOTOS[1]?.alt || ""}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-center group-hover:brightness-90 transition-all duration-300"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-lg">
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom-right photo */}
        <div
          className="relative hidden md:block cursor-zoom-in group"
          onClick={() => openLightbox(2)}
        >
          <img
            src={ROOM_PHOTOS[2]?.src || ROOM_PHOTOS[0].src}
            alt={ROOM_PHOTOS[2]?.alt || ""}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-center group-hover:brightness-90 transition-all duration-300"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-lg">
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"
                />
              </svg>
            </div>
          </div>
          {/* "Lihat semua" button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              openLightbox(0);
            }}
            className="absolute bottom-3 right-3 flex items-center gap-2 bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md hover:bg-gray-50 transition-colors border border-gray-200"
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
                d="M4 6h16M4 10h16M4 14h8"
              />
            </svg>
            Lihat semua foto
          </button>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors z-10"
            onClick={closeLightbox}
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

          {/* Prev */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors z-10"
            onClick={(e) => {
              e.stopPropagation();
              prevPhoto();
            }}
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Next */}
          <button
            className="absolute right-16 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors z-10"
            onClick={(e) => {
              e.stopPropagation();
              nextPhoto();
            }}
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Zoom controls */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/50 rounded-full px-4 py-2 z-10">
            <button
              className="text-white hover:text-gray-300 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setZoom((z) => Math.max(1, z - 0.5));
                setTranslate({ x: 0, y: 0 });
              }}
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
                  d="M20 12H4"
                />
              </svg>
            </button>
            <span className="text-white text-sm min-w-[3rem] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              className="text-white hover:text-gray-300 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setZoom((z) => Math.min(4, z + 0.5));
              }}
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
            <span className="text-white/40 mx-1">|</span>
            <span className="text-white/60 text-xs">
              {lightbox.idx + 1} / {ROOM_PHOTOS.length}
            </span>
          </div>

          {/* Image */}
          <div
            className="max-w-[90vw] max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              cursor: zoom > 1 ? (dragging ? "grabbing" : "grab") : "default",
            }}
          >
            <img
              src={ROOM_PHOTOS[lightbox.idx].src}
              alt={ROOM_PHOTOS[lightbox.idx].alt}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg select-none transition-transform duration-150"
              style={{
                transform: `scale(${zoom}) translate(${translate.x / zoom}px, ${
                  translate.y / zoom
                }px)`,
                transformOrigin: "center center",
              }}
              draggable={false}
            />
          </div>

          {/* Label */}
          <div className="absolute top-4 left-4 text-white/80 text-sm font-medium">
            {ROOM_PHOTOS[lightbox.idx].label}
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT + SIDEBAR ── */}
      <div className="grid md:grid-cols-3 gap-10">
        {/* Left: Content */}
        <div className="md:col-span-2 space-y-0">
          {/* Quick info chips */}
          <div className="flex flex-wrap gap-2 py-6 border-b border-gray-100">
            {[
              {
                icon: "🏠",
                label: "Lantai",
                value: room.floor ? `Lantai ${room.floor}` : "Lantai 1",
              },
              { icon: "📐", label: "Luas", value: "3 × 4 m²" },
              { icon: "🏷️", label: "Tipe", value: "Kost Standar" },
              { icon: "👥", label: "Untuk", value: "Putra / Putri" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-100"
              >
                <span className="text-base">{item.icon}</span>
                <div>
                  <div className="text-[10px] text-gray-400 leading-none">
                    {item.label}
                  </div>
                  <div className="text-sm font-semibold text-gray-700">
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Host info */}
          <div className="flex items-center gap-4 py-6 border-b border-gray-100">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              K
            </div>
            <div>
              <div className="font-semibold text-gray-800">
                Hosted by Koji Kost
              </div>
              <div className="text-sm text-gray-500 flex items-center gap-2 mt-0.5">
                <span className="flex items-center gap-1">
                  <svg
                    className="w-3.5 h-3.5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  4.8 · 24 ulasan
                </span>
                <span className="text-gray-300">·</span>
                <span>Respon dalam 1 jam</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="py-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              Tentang Kamar Ini
            </h2>
            <p className="text-gray-600 leading-relaxed text-[15px]">
              Kamar kost nyaman dengan fasilitas lengkap. Cocok untuk mahasiswa
              atau pekerja yang mencari hunian praktis dengan akses mudah ke
              berbagai fasilitas umum. Lingkungan aman dan tenang, tersedia
              parkir kendaraan.
            </p>
          </div>

          {/* Facilities */}
          <div className="py-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Fasilitas yang Tersedia
            </h2>
            {room.facilities && room.facilities.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {[...room.facilities, "Iuran Sampah Gratis"].map(
                  (facility, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 text-gray-700"
                    >
                      <svg
                        className="w-5 h-5 text-gray-900 flex-shrink-0"
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
                      <span className="text-sm">{facility}</span>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {[
                  "WiFi Gratis",
                  "Kamar Mandi Dalam",
                  "Listrik (Token)",
                  "Air Bersih",
                  "Lemari Pakaian",
                  "Parkir Motor",
                  "Iuran Sampah Gratis",
                ].map((f, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 text-gray-700"
                  >
                    <svg
                      className="w-5 h-5 text-gray-900 flex-shrink-0"
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
                    <span className="text-sm">{f}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Rules */}
          <div className="py-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Peraturan Kost
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { icon: "🕙", text: "Tamu menginap maks 22.00" },
                { icon: "🐾", text: "Tidak boleh membawa hewan peliharaan" },
                { icon: "🧹", text: "Menjaga kebersihan dan ketenangan" },
                { icon: "💳", text: "Pembayaran dilakukan di awal bulan" },
              ].map((rule, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-gray-50"
                >
                  <span className="text-base flex-shrink-0">{rule.icon}</span>
                  <span className="text-sm text-gray-600">{rule.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback Form */}
          <div className="py-6">
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              Tulis Feedback
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
              <input
                value={fbName}
                onChange={(e) => setFbName(e.target.value)}
                placeholder="Nama kamu"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all text-sm"
              />
              <textarea
                value={fbMessage}
                onChange={(e) => setFbMessage(e.target.value)}
                placeholder="Tulis feedback atau review kamu di sini..."
                required
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all resize-none text-sm"
              />
              <button
                type="submit"
                disabled={fbLoading}
                className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                  fbLoading
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-900 text-white hover:bg-gray-700"
                }`}
              >
                {fbLoading ? "Mengirim..." : "Kirim Feedback"}
              </button>
            </form>
          </div>
        </div>

        {/* Right: Sticky Booking Card */}
        <div className="md:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-gray-200 shadow-xl shadow-gray-100 p-6 bg-white">
            {/* Price header */}
            <div className="flex items-end gap-1 mb-1">
              <span className="text-2xl font-extrabold text-gray-900">
                Rp {room.price?.toLocaleString("id-ID")}
              </span>
              <span className="text-gray-500 text-sm mb-0.5">/bulan</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-5">
              <svg
                className="w-3.5 h-3.5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              4.8 <span className="text-gray-300 mx-1">·</span> 24 ulasan
            </div>

            {msg.text && (
              <div
                className={`mb-4 p-3 rounded-xl text-sm font-medium ${
                  msg.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {msg.text}
              </div>
            )}

            {room.status === "available" ? (
              <form onSubmit={book} className="space-y-3">
                {/* Date inputs grouped */}
                <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-200">
                  <div className="px-4 py-3">
                    <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Tanggal Mulai
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      className="w-full text-sm text-gray-700 focus:outline-none"
                    />
                  </div>
                  <div className="px-4 py-3">
                    <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Tanggal Selesai
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                      className="w-full text-sm text-gray-700 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={booking}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    booking
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:shadow-lg hover:shadow-primary-500/30 active:scale-[0.98]"
                  }`}
                >
                  {booking ? (
                    <>
                      <svg
                        className="animate-spin w-4 h-4"
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
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "Book Sekarang"
                  )}
                </button>

                {/* Total */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-sm">
                  <span className="text-gray-500">Total per bulan</span>
                  <span className="font-bold text-gray-900">
                    Rp {room.price?.toLocaleString("id-ID")}
                  </span>
                </div>

                {!logged && (
                  <p className="text-center text-xs text-gray-500">
                    <Link
                      to="/login"
                      className="text-primary-600 hover:underline font-medium"
                    >
                      Login
                    </Link>{" "}
                    untuk melakukan booking
                  </p>
                )}
              </form>
            ) : (
              <div className="text-center py-6">
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg
                    className="w-7 h-7 text-gray-400"
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
                <p className="text-gray-500 text-sm mb-3">
                  Kamar ini sedang tidak tersedia
                </p>
                <Link
                  to="/"
                  className="text-primary-600 hover:underline text-sm font-medium"
                >
                  Lihat kamar lainnya
                </Link>
              </div>
            )}

            {/* Contact Owner */}
            <a
              href="https://wa.me/6281338059744"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 w-full py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
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
          </div>
        </div>
      </div>
    </div>
  );
}
