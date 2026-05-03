import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function formatPrice(price) {
  if (!price) return "—";
  if (price >= 1_000_000) {
    const val = price / 1_000_000;
    return `Rp${val % 1 === 0 ? val : val.toFixed(1)}jt`;
  }
  return `Rp${price.toLocaleString("id-ID")}`;
}

export default function Home() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    api
      .get("/rooms")
      .then((res) => setRooms(res.data))
      .catch(() => {});
  }, []);

  // Show up to 3 rooms as featured preview
  const featured = rooms.slice(0, 3);

  return (
    <div className="min-h-screen" style={{ background: "#F3EDE3" }}>
      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 grid md:grid-cols-2 gap-12 items-center">
        {/* Left — copy */}
        <div>
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ color: "#c9862b" }}
          >
            Comfort Living in Bali
          </p>

          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-5"
            style={{ color: "#111827", letterSpacing: "-0.02em" }}
          >
            Hunian Nyaman,
            <br />
            Bersih &amp;
            <br />
            Strategis
          </h1>

          <p className="text-base md:text-lg text-gray-500 max-w-sm mb-8 leading-relaxed">
            Kost modern dengan WiFi cepat, parkir aman, dan suasana tenang di
            Bali.
          </p>

          <div className="flex items-center gap-4 flex-wrap">
            <Link
              to="/rooms"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 hover:-translate-y-px"
              style={{ background: "#1b3a2d" }}
            >
              View Rooms
            </Link>
            <a
              href="https://wa.me/6281338059744"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:bg-white/60"
              style={{ color: "#1b3a2d", border: "1.5px solid #1b3a2d" }}
            >
              WhatsApp
            </a>
          </div>
        </div>

        {/* Right — room photo placeholder */}
        <div className="flex justify-center md:justify-end">
          <div
            className="w-full max-w-md aspect-[4/3] rounded-3xl flex items-center justify-center text-sm font-medium overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #e8ddd0 0%, #d5c8b8 100%)",
              color: "#9c8e80",
            }}
          >
            <img
              src="/lantai1-area.png"
              alt="Room Photo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── Featured Rooms ── */}
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section header */}
          <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
            <div>
              <p
                className="text-xs font-semibold tracking-widest uppercase mb-1"
                style={{ color: "#c9862b" }}
              >
                Pilihan Kamar
              </p>
              <h2 className="text-2xl font-bold" style={{ color: "#111827" }}>
                Kamar Tersedia
              </h2>
            </div>
            <Link
              to="/rooms"
              className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all hover:opacity-70"
              style={{ color: "#1b3a2d" }}
            >
              Lihat semua kamar
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          {featured.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-4 overflow-hidden"
                  style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}
                >
                  <div
                    className="h-44 rounded-xl mb-4"
                    style={{ background: "#e8e0d5" }}
                  />
                  <div
                    className="h-4 rounded mb-2 w-3/4"
                    style={{ background: "#e0d8cc" }}
                  />
                  <div
                    className="h-3 rounded w-1/3"
                    style={{ background: "#e0d8cc" }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((room, i) => (
                <RoomPreviewCard key={room._id} room={room} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Why Us ── */}
      <section className="pb-20 max-w-6xl mx-auto px-6">
        <div className="mb-8">
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-1"
            style={{ color: "#c9862b" }}
          >
            Keunggulan Kami
          </p>
          <h2 className="text-2xl font-bold" style={{ color: "#111827" }}>
            Kenapa Pilih Koji Kost?
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: "🛜",
              title: "WiFi Cepat",
              desc: "Koneksi internet stabil & cepat tersedia 24 jam di seluruh area kost.",
            },
            {
              icon: "📹",
              title: "Aman & Terjaga",
              desc: "CCTV aktif, pintu akses terkunci, dan lingkungan kost yang kondusif.",
            },
            {
              icon: "🏍️",
              title: "Parkir Luas",
              desc: "Area parkir motor tertata rapi, aman, dan mudah diakses untuk semua penghuni kost.",
            },
            {
              icon: "🧹",
              title: "Bersih & Nyaman",
              desc: "Iuran sampah gratis, lingkungan terawat, dan fasilitas bersama selalu bersih.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl p-6"
              style={{
                border: "1.5px solid rgba(27,58,45,0.08)",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                style={{ background: "rgba(27,58,45,0.07)" }}
              >
                {item.icon}
              </div>
              <h3 className="font-bold text-gray-900 mb-1.5">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Location ── */}
      <section id="location" className="pb-20 max-w-6xl mx-auto px-6">
        <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
          <div>
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-1"
              style={{ color: "#c9862b" }}
            >
              Temukan Kami
            </p>
            <h2 className="text-2xl font-bold" style={{ color: "#111827" }}>
              Lokasi
            </h2>
          </div>
          <a
            href="https://maps.app.goo.gl/EJaM3fDA8AZAufr3A"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
            style={{
              background: "#1b3a2d",
              color: "#fff",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Buka di Maps
          </a>
        </div>

        <div
          className="overflow-hidden rounded-2xl"
          style={{
            boxShadow: "0 2px 16px rgba(27,58,45,0.10)",
            border: "1.5px solid rgba(27,58,45,0.10)",
          }}
        >
          <iframe
            title="Lokasi Koji Kost"
            width="100%"
            height="280"
            className="block md:hidden"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src="https://maps.google.com/maps?q=-8.6657079,115.2501329&t=&z=18&ie=UTF8&iwloc=&output=embed"
          />
          <iframe
            title="Lokasi Koji Kost Desktop"
            width="100%"
            height="400"
            className="hidden md:block"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src="https://maps.google.com/maps?q=-8.6657079,115.2501329&t=&z=18&ie=UTF8&iwloc=&output=embed"
          />
        </div>

        <div className="mt-4 flex items-start gap-3">
          <span
            className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(27,58,45,0.08)" }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1b3a2d"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </span>
          <div>
            <p className="text-sm font-semibold" style={{ color: "#111827" }}>
              Koji Kost Bali
            </p>
            <p className="text-sm" style={{ color: "#6b7280" }}>
              Bali, Indonesia · Dekat pusat kota &amp; transportasi umum
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="py-8 px-6 text-center text-xs"
        style={{ color: "#9c8e80", borderTop: "1px solid rgba(27,58,45,0.08)" }}
      >
        © 2026 Koji Kost Bali
      </footer>
    </div>
  );
}

const FALLBACK_IMAGES = [
  "/kamar-tidur.jpeg",
  "/kamar-mandi.jpeg",
  "/dapur.jpeg",
];

const STATUS_LABEL = {
  available: {
    text: "Tersedia",
    dot: "bg-green-400 animate-pulse",
    color: "text-green-700",
    bg: "bg-green-50",
  },
  occupied: {
    text: "Terisi",
    dot: "bg-red-400",
    color: "text-red-700",
    bg: "bg-red-50",
  },
  maintenance: {
    text: "Perbaikan",
    dot: "bg-yellow-400",
    color: "text-yellow-700",
    bg: "bg-yellow-50",
  },
};

/* ── Room Preview Card ── */
function RoomPreviewCard({ room, index }) {
  const fallbackImg = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
  const priceDisplay = formatPrice(room.price);
  const statusMeta = STATUS_LABEL[room.status] || STATUS_LABEL.available;

  return (
    <Link
      to={`/rooms/${room._id}`}
      className="group block bg-white rounded-2xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg"
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}
    >
      {/* Image */}
      <div className="h-48 w-full overflow-hidden relative bg-gray-100">
        <img
          src={room.image || fallbackImg}
          alt={`Kamar ${room.roomNumber}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Price overlay */}
        <div
          className="absolute bottom-3 left-3 px-3 py-1 rounded-lg text-xs font-bold text-white"
          style={{
            background: "rgba(27,58,45,0.85)",
            backdropFilter: "blur(4px)",
          }}
        >
          {priceDisplay}
          <span className="font-normal opacity-80"> /bln</span>
        </div>
        {/* Status badge */}
        <div
          className={`absolute top-3 right-3 inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${statusMeta.bg} ${statusMeta.color}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dot}`}></span>
          {statusMeta.text}
        </div>
      </div>

      {/* Info */}
      <div className="px-5 py-4 flex items-center justify-between">
        <div>
          <p className="font-bold text-gray-900 text-sm">
            Kamar {room.roomNumber}
          </p>
          {room.floor && (
            <p className="text-xs text-gray-400 mt-0.5">Lantai {room.floor}</p>
          )}
        </div>
        <span
          className="text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all"
          style={{ color: "#1b3a2d" }}
        >
          Lihat detail
          <svg
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}
