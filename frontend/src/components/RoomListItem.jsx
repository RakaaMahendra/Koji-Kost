import React from "react";
import { Link } from "react-router-dom";

const STATUS_CONFIG = {
  available: {
    label: "Tersedia",
    dot: "bg-green-400 animate-pulse",
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

export default function RoomListItem({ room }) {
  const status = STATUS_CONFIG[room.status] || STATUS_CONFIG.available;

  return (
    <Link to={`/rooms/${room._id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden flex gap-0 shadow-sm hover:shadow-lg transition-shadow duration-300 animate-fade-in">
        {/* Photo */}
        <div className="relative w-36 sm:w-44 flex-shrink-0 overflow-hidden bg-gray-100">
          <img
            src={room.image || "/kamar-tidur.jpeg"}
            alt={`Kamar ${room.roomNumber}`}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/5"></div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 p-4 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            {/* Left info */}
            <div className="min-w-0">
              <h3 className="font-bold text-gray-900 text-[15px] truncate">
                Kamar {room.roomNumber}
              </h3>
              {room.floor && (
                <p className="text-xs text-gray-400 mt-0.5">
                  Lantai {room.floor}
                </p>
              )}
              {room.facilities && room.facilities.length > 0 && (
                <p className="text-xs text-gray-500 mt-2 truncate">
                  {room.facilities.slice(0, 4).map((f, i) => (
                    <span key={i}>
                      {i > 0 && <span className="mx-1 text-gray-300">•</span>}
                      {f}
                    </span>
                  ))}
                  {room.facilities.length > 4 && (
                    <span className="text-gray-400">
                      {" "}
                      +{room.facilities.length - 4}
                    </span>
                  )}
                </p>
              )}
            </div>

            {/* Price */}
            <div className="text-right flex-shrink-0">
              <div className="text-base font-extrabold text-gray-900">
                Rp{room.price?.toLocaleString("id-ID")}
              </div>
              <div className="text-[11px] text-gray-400">/bulan</div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${status.bg} ${status.text}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
              {status.label}
            </span>
            <span
              className={`text-sm font-semibold flex items-center gap-1 transition-colors ${
                room.status === "available"
                  ? "text-gray-700 group-hover:text-gray-900"
                  : "text-gray-400"
              }`}
            >
              Lihat detail
              <svg
                className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
