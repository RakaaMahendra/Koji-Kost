import React from "react";
import { Link } from "react-router-dom";

const STATUS_CONFIG = {
  available: {
    label: "Tersedia",
    dot: "bg-green-400",
    text: "text-green-700",
    bg: "bg-green-50 border-green-200",
  },
  occupied: {
    label: "Terisi",
    dot: "bg-red-400",
    text: "text-red-700",
    bg: "bg-red-50 border-red-200",
  },
  maintenance: {
    label: "Perbaikan",
    dot: "bg-yellow-400",
    text: "text-yellow-700",
    bg: "bg-yellow-50 border-yellow-200",
  },
};

export default function RoomCard({ room }) {
  const status = STATUS_CONFIG[room.status] || STATUS_CONFIG.available;

  return (
    <Link to={`/rooms/${room._id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 animate-fade-in">
        {/* Photo */}
        <div className="relative h-52 overflow-hidden bg-gray-100">
          <img
            src={room.image || "/kamar-tidur.jpeg"}
            alt={`Kamar ${room.roomNumber}`}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

          {/* Status pill */}
          <div
            className={`absolute top-3 right-3 inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${status.bg} ${status.text}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${status.dot} ${
                room.status === "available" ? "animate-pulse" : ""
              }`}
            ></span>
            {status.label}
          </div>

          {/* Floor chip */}
          {room.floor && (
            <div className="absolute bottom-3 left-3 text-xs font-medium text-white/90 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
              Lantai {room.floor}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-4">
          {/* Title row */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <h3 className="font-bold text-gray-900 text-[15px] leading-tight">
                Kamar {room.roomNumber}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">Sewa bulanan</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-base font-extrabold text-gray-900">
                Rp{room.price?.toLocaleString("id-ID")}
              </div>
              <div className="text-[11px] text-gray-400">/bulan</div>
            </div>
          </div>

          {/* Facility tags */}
          {room.facilities && room.facilities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {room.facilities.slice(0, 3).map((f, i) => (
                <span
                  key={i}
                  className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full"
                >
                  {f}
                </span>
              ))}
              {room.facilities.length > 3 && (
                <span className="text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  +{room.facilities.length - 3}
                </span>
              )}
            </div>
          )}

          {/* CTA */}
          <div
            className={`w-full text-center py-2.5 rounded-xl text-sm font-semibold transition-all ${
              room.status === "available"
                ? "bg-gray-900 text-white group-hover:bg-gray-700"
                : "bg-gray-100 text-gray-400 cursor-default"
            }`}
          >
            {room.status === "available" ? "Lihat & Booking" : "Tidak Tersedia"}
          </div>
        </div>
      </div>
    </Link>
  );
}
