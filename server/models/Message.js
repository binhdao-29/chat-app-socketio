const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  chatroom: {
    type: mongoose.Schema.Types.ObjectId,
    required: "Chatroom is required!",
    ref: "Chatroom",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: "User is required!",
    ref: "User",
  },
  userAvatar: {
    type: String
  },
  name: {
    type: String,
  },
  message: {
    type: String,
    required: "Message is required!",
  },
});

module.exports = mongoose.model("Message", messageSchema);
