import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Terjadi kesalahan. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#F3EDE3" }}
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <Link
            to="/"
            className="inline-block text-2xl font-extrabold mb-8"
            style={{ color: "#1b3a2d", letterSpacing: "-0.03em" }}
          >
            KOJI KOST
          </Link>

          {sent ? (
            <>
              {/* Success state */}
              <div
                className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center"
                style={{ background: "#d1fae5" }}
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="#047857"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h1
                className="text-2xl font-bold mb-2"
                style={{ color: "#111827" }}
              >
                Cek Email Kamu
              </h1>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                Kami telah mengirim link reset password ke{" "}
                <strong className="text-gray-700">{email}</strong>. Periksa
                inbox atau folder spam kamu.
              </p>
              <p className="text-xs text-gray-400 mt-3">
                Link berlaku selama 1 jam.
              </p>
            </>
          ) : (
            <>
              <h1
                className="text-2xl font-bold mb-2"
                style={{ color: "#111827" }}
              >
                Lupa Password?
              </h1>
              <p className="text-gray-500 text-sm">
                Masukkan email kamu dan kami akan mengirim link untuk reset
                password.
              </p>
            </>
          )}
        </div>

        {!sent && (
          <div
            className="bg-white rounded-2xl p-8"
            style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}
          >
            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3">
                <svg
                  className="w-4 h-4 text-red-500 flex-shrink-0"
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
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            <form onSubmit={submit} className="space-y-5">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "#374151" }}
                >
                  Alamat Email
                </label>
                <div className="relative">
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
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 transition-all text-sm"
                    style={{ outline: "none" }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-semibold text-sm text-white transition-all flex items-center justify-center gap-2"
                style={{
                  background: loading ? "#9ca3af" : "#1b3a2d",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? (
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
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Mengirim...
                  </>
                ) : (
                  "Kirim Link Reset"
                )}
              </button>
            </form>
          </div>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          Ingat password?{" "}
          <Link
            to="/login"
            className="font-semibold"
            style={{ color: "#1b3a2d" }}
          >
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
