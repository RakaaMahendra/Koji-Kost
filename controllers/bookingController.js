import Booking from "../models/Booking.js";
import Room from "../models/Room.js";

// Helper: bebaskan kamar yang masa sewa-nya sudah berakhir
const expireFinishedBookings = async () => {
  const now = new Date();
  const expired = await Booking.find({
    status: "approved",
    endDate: { $lt: now },
  });
  for (const b of expired) {
    b.status = "rejected"; // tandai expired
    await b.save();
    await Room.findByIdAndUpdate(b.room, { status: "available" });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { roomId, startDate, endDate } = req.body;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (room.status !== "available") {
      return res.status(400).json({ message: "Room not available" });
    }

    // Cek apakah user sudah menghuni kamar lain (booking approved yang belum expired)
    const existing = await Booking.findOne({
      user: req.user.id,
      status: "approved",
      endDate: { $gte: new Date() },
    });
    if (existing) {
      return res.status(400).json({
        message:
          "Kamu sudah menghuni sebuah kamar. Selesaikan masa sewa terlebih dahulu.",
      });
    }

    const booking = await Booking.create({
      user: req.user.id,
      room: roomId,
      startDate,
      endDate,
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate("room");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    await expireFinishedBookings();
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("room");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status;
    await booking.save();

    if (status === "approved") {
      await Room.findByIdAndUpdate(booking.room, { status: "occupied" });
    } else if (status === "rejected") {
      // Bebaskan kamar saat booking ditolak/dibatalkan
      await Room.findByIdAndUpdate(booking.room, { status: "available" });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Bebaskan kamar bila booking yang dihapus sedang approved
    if (booking.status === "approved") {
      await Room.findByIdAndUpdate(booking.room, { status: "available" });
    }

    await booking.deleteOne();
    res.json({ message: "Booking deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
