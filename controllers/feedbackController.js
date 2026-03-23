import Feedback from "../models/Feedback.js";

export const createFeedback = async (req, res) => {
  try {
    const { name, message } = req.body;
    if (!name || !message) {
      return res.status(400).json({ message: "Nama dan pesan wajib diisi" });
    }
    const feedback = await Feedback.create({
      name,
      message,
      user: req.user?.id || null,
    });
    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) return res.status(404).json({ message: "Feedback not found" });
    res.json({ message: "Feedback deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const toggleFeedbackDone = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ message: "Feedback not found" });
    feedback.done = !feedback.done;
    await feedback.save();
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
