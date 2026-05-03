import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Password tidak cocok");
      return;
    }
    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      setDone(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Token tidak valid atau sudah kedaluwarsa."
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

          {done ? (
            <>
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
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1
                className="text-2xl font-bold mb-2"
                style={{ color: "#111827" }}
              >
                Password Berhasil Diubah
              </h1>
              <p className="text-gray-500 text-sm">
                Kamu akan diarahkan ke halaman login dalam beberapa detik...
              </p>
              <Link
                to="/login"
                className="inline-block mt-4 text-sm font-semibold"
                style={{ color: "#1b3a2d" }}
              >
                Masuk sekarang →
              </Link>
            </>
          ) : (
            <>
              <h1
                className="text-2xl font-bold mb-2"
                style={{ color: "#111827" }}
              >
                Buat Password Baru
              </h1>
              <p className="text-gray-500 text-sm">
                Password baru minimal 6 karakter.
              </p>
            </>
          )}
        </div>

        {!done && (
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
              {/* New password */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "#374151" }}
                >
                  Password Baru
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
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-gray-200 transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? (
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
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "#374151" }}
                >
                  Konfirmasi Password
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
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <input
                    type={showPass ? "text" : "password"}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 transition-all text-sm"
                  />
                </div>
                {confirm && password !== confirm && (
                  <p className="text-xs text-red-500 mt-1.5">
                    Password tidak cocok
                  </p>
                )}
              </div>

              {/* Strength indicator */}
              <div className="flex gap-1.5 pt-1">
                {[1, 2, 3, 4].map((lvl) => {
                  const strength =
                    password.length === 0
                      ? 0
                      : password.length < 6
                      ? 1
                      : password.length < 10
                      ? 2
                      : /[A-Z]/.test(password) && /[0-9]/.test(password)
                      ? 4
                      : 3;
                  return (
                    <div
                      key={lvl}
                      className="h-1 flex-1 rounded-full transition-all"
                      style={{
                        background:
                          lvl <= strength
                            ? strength <= 1
                              ? "#ef4444"
                              : strength === 2
                              ? "#f59e0b"
                              : strength === 3
                              ? "#3b82f6"
                              : "#10b981"
                            : "#e5e7eb",
                      }}
                    />
                  );
                })}
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
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Password Baru"
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
