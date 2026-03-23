import React from "react";
import { Link } from "react-router-dom";

export default function RoomCard({ room }) {
  const getStatusBadge = (status) => {
    const styles = {
      available: "badge-available",
      occupied: "badge-occupied",
      maintenance: "badge-maintenance",
    };
    return styles[status] || "badge-available";
  };

  return (
    <div className="card overflow-hidden group animate-fade-in">
      {/* Room Image */}
      <div className="relative h-48 bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 overflow-hidden">
        {room.image ? (
          <img
            src={room.image}
            alt={`Room ${room.roomNumber}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-white">
              <svg
                className="w-12 h-12 mx-auto mb-2 opacity-80"
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
              <div className="font-bold text-lg">Room {room.roomNumber}</div>
            </div>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`badge ${getStatusBadge(room.status)}`}>
            {room.status === "available" && (
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            )}
            {room.status}
          </span>
        </div>

        {/* Favorite Button */}
        <button className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-lg opacity-0 group-hover:opacity-100">
          <svg
            className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors"
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

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Room {room.roomNumber}
            </h3>
            <p className="text-sm text-gray-500">Monthly Rental</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-primary-600">
              Rp {room.price?.toLocaleString("id-ID")}
            </div>
            <div className="text-xs text-gray-500">/bulan</div>
          </div>
        </div>

        {/* Facilities */}
        {room.facilities && room.facilities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {room.facilities.slice(0, 3).map((facility, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gray-100 text-xs text-gray-600"
              >
                {facility}
              </span>
            ))}
            {room.facilities.length > 3 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gray-100 text-xs text-gray-500">
                +{room.facilities.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
          <Link
            to={`/rooms/${room._id}`}
            className="flex-1 text-center py-2.5 rounded-lg border border-primary-200 text-primary-600 font-medium hover:bg-primary-50 transition-colors"
          >
            View Details
          </Link>
          {room.status === "available" && (
            <Link
              to={`/rooms/${room._id}`}
              className="flex-1 text-center py-2.5 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium hover:shadow-lg hover:shadow-primary-500/30 transition-all"
            >
              Book Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
