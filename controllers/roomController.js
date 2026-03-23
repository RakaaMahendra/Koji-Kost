import Room from "../models/Room.js";

export const getRooms = async (req, res) => {
  const rooms = await Room.find();
  res.json(rooms);
};

export const getRoomById = async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (!room) return res.status(404).json({ message: "Room not found" });

  res.json(room);
};

export const createRoom = async (req, res) => {
  const room = await Room.create(req.body);
  res.status(201).json(room);
};

export const updateRoom = async (req, res) => {
  const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.json(room);
};

export const deleteRoom = async (req, res) => {
  await Room.findByIdAndDelete(req.params.id);
  res.json({ message: "Room deleted" });
};

export const updateStatus = async (req, res) => {
  const room = await Room.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );

  res.json(room);
};
