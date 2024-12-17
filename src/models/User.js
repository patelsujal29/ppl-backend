const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  quizzesCreated: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }],
  quizzesAttempted: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }],
});

module.exports = mongoose.model("User", userSchema);
