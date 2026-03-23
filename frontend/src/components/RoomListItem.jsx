import React from "react";
import { Link } from "react-router-dom";

export default function RoomListItem({ room }) {
  const getStatusBadge = (status) => {
    const styles = {
      available: "badge-available",
      occupied: "badge-occupied",
      maintenance: "badge-maintenance",
    };
    return styles[status] || "badge-available";
  };

  return (
    <Link to={`/rooms/${room._id}`} className="block">
      <div className="room-list-item animate-fade-in">
        {/* Room Image */}
        <div className="relative flex-shrink-0">
          {room.image ? (
            <img
              src={room.image}
              alt={`Room ${room.roomNumber}`}
              className="w-40 h-28 object-cover rounded-xl"
            />
          ) : (
            <div className="w-40 h-28 rounded-xl bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 flex items-center justify-center">
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
                  {room.roomNumber}
                </div>
              </div>
            </div>
          )}

          {/* Quick Status Indicator */}
          <div className="absolute -top-1 -right-1">
            {room.status === "available" && (
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-white"></span>
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              {/* Type Badge */}
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary-50 text-primary-700 text-xs font-medium">
                  {room.facilities?.includes("Campur")
                    ? "Kost Campur"
                    : "Kost Exclusive"}
                </span>
              </div>

              {/* Room Name */}
              <h3 className="font-semibold text-gray-900 truncate">
                Kost Room {room.roomNumber}
              </h3>

              {/* Facilities */}
              <p className="text-sm text-gray-500 mt-1 truncate">
                {(room.facilities || []).slice(0, 4).map((f, i) => (
                  <span key={i}>
                    {i > 0 && <span className="mx-1.5">•</span>}
                    {f}
                  </span>
                ))}
              </p>
            </div>

            {/* Price */}
            <div className="text-right flex-shrink-0">
              <div className="text-lg font-bold text-primary-600">
                Rp{room.price?.toLocaleString("id-ID")}
              </div>
              <div className="text-xs text-gray-500">/bulan</div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`badge text-xs ${getStatusBadge(room.status)}`}>
                {room.status}
              </span>
              <div className="flex items-center text-xs text-gray-500">
                <svg
                  className="w-4 h-4 text-yellow-400 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                4.8
              </div>
            </div>

            <span className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
              Lihat detail
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
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
