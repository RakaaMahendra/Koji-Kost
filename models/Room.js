import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    facilities: [String],
    floor: {
      type: Number,
      enum: [1, 2],
      default: 1,
    },
    status: {
      type: String,
      enum: ["available", "occupied", "maintenance"],
      default: "available",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);
