import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const logged = !!localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    navigate("/login");
    setMobileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `text-sm font-medium transition-colors ${
      isActive(path)
        ? "text-primary-800 font-semibold"
        : "text-gray-600 hover:text-primary-800"
    }`;

  return (
    <>
      <nav className="site-nav">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-extrabold tracking-tight"
            style={{ color: "#1b3a2d", letterSpacing: "-0.03em" }}
          >
            KOJI KOST
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className={linkClass("/")}>
              Home
            </Link>
            <Link to="/rooms" className={linkClass("/rooms")}>
              Rooms
            </Link>
            <a
              href="/#location"
              className="text-sm font-medium text-gray-600 hover:text-primary-800 transition-colors"
            >
              Location
            </a>
            {logged && (
              <Link to="/bookings" className={linkClass("/bookings")}>
                My Bookings
              </Link>
            )}
            {role === "admin" && (
              <Link to="/admin" className={linkClass("/admin")}>
                Admin
              </Link>
            )}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {logged ? (
              <button
                onClick={logout}
                className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 hover:text-primary-800 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/rooms"
                  className="text-sm font-semibold text-white px-5 py-2.5 rounded-xl transition-all hover:opacity-90"
                  style={{ background: "#1b3a2d" }}
                >
                  Book Now
                </Link>
              </>
            )}
            {logged && (
              <Link
                to="/rooms"
                className="text-sm font-semibold text-white px-5 py-2.5 rounded-xl transition-all hover:opacity-90"
                style={{ background: "#1b3a2d" }}
              >
                Book Now
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 rounded-lg transition-colors"
            style={{ color: "#1b3a2d" }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="mobile-menu md:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="mobile-menu-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <span
                className="text-lg font-extrabold"
                style={{ color: "#1b3a2d", letterSpacing: "-0.03em" }}
              >
                KOJI KOST
              </span>
              <button onClick={() => setMobileOpen(false)} className="p-1">
                <svg
                  className="w-5 h-5 text-gray-500"
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

            <div className="space-y-1">
              {[
                { to: "/", label: "Home" },
                { to: "/rooms", label: "Rooms" },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive(to)
                      ? "text-primary-800 font-semibold"
                      : "text-gray-700 hover:bg-black/5"
                  }`}
                >
                  {label}
                </Link>
              ))}
              {logged && (
                <Link
                  to="/bookings"
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive("/bookings")
                      ? "text-primary-800 font-semibold"
                      : "text-gray-700 hover:bg-black/5"
                  }`}
                >
                  My Bookings
                </Link>
              )}
              {role === "admin" && (
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive("/admin")
                      ? "text-primary-800 font-semibold"
                      : "text-gray-700 hover:bg-black/5"
                  }`}
                >
                  Admin
                </Link>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-black/10 space-y-3">
              {logged ? (
                <button
                  onClick={logout}
                  className="w-full py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block w-full py-3 rounded-xl text-sm font-medium text-center text-gray-700 hover:bg-black/5 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/rooms"
                    onClick={() => setMobileOpen(false)}
                    className="block w-full py-3 rounded-xl text-sm font-semibold text-center text-white transition-all hover:opacity-90"
                    style={{ background: "#1b3a2d" }}
                  >
                    Book Now
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
