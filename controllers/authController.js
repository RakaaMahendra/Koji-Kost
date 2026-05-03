import User from "../models/User.js";
import Booking from "../models/Booking.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

export const register = async (req, res) => {
  try {
    const { name, username, email, password, role } = req.body;

    if (await User.findOne({ username })) {
      return res.status(400).json({ message: "Username sudah digunakan" });
    }
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: "User registered",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Username atau password salah" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Username atau password salah" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login success",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "admin") {
      return res.status(403).json({ message: "Cannot delete admin account" });
    }
    await Booking.deleteMany({ user: req.params.id });
    await user.deleteOne();
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ── Forgot Password ── */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email wajib diisi" });
    }

    const user = await User.findOne({ email });
    // Always return 200 to avoid email enumeration
    if (!user) {
      return res.json({
        message: "Jika email terdaftar, link reset password telah dikirim.",
      });
    }

    // Generate raw token, store hashed version
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    const resetUrl = `${
      process.env.FRONTEND_URL || "http://localhost:5173"
    }/reset-password/${rawToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        // strip spaces — Google App Password kadang disalin dengan spasi
        pass: (process.env.SMTP_PASS || "").replace(/\s/g, ""),
      },
    });

    await transporter.sendMail({
      from: `"Koji Kost" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: "Reset Password Koji Kost",
      html: `
        <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#F3EDE3;border-radius:16px;">
          <h2 style="color:#1b3a2d;margin-bottom:8px;font-size:22px;">Reset Password</h2>
          <p style="color:#374151;margin-bottom:24px;line-height:1.6;">
            Halo <strong>${user.name}</strong>,<br/>
            Kami menerima permintaan untuk mereset password akun Koji Kost kamu.
            Klik tombol di bawah untuk melanjutkan:
          </p>
          <a href="${resetUrl}"
            style="display:inline-block;background:#1b3a2d;color:#fff;padding:12px 28px;border-radius:10px;text-decoration:none;font-weight:600;font-size:14px;">
            Reset Password
          </a>
          <p style="color:#9c8e80;font-size:12px;margin-top:24px;">
            Link ini berlaku selama <strong>1 jam</strong>. Jika kamu tidak meminta reset password, abaikan email ini.
          </p>
          <p style="color:#9c8e80;font-size:11px;margin-top:8px;">
            Atau copy link ini:<br/><span style="word-break:break-all;">${resetUrl}</span>
          </p>
        </div>
      `,
    });

    res.json({
      message: "Jika email terdaftar, link reset password telah dikirim.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ── Reset Password ── */
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password minimal 6 karakter" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Token tidak valid atau sudah kedaluwarsa" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: "Password berhasil direset. Silakan login." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
