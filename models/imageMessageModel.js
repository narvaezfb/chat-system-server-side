const mongoose = require("mongoose");

const imageMessage = new mongoose.Schema({
	id: { type: String },
	originalname: { type: String },
	filename: { type: String },
	encoding: { type: String },
	mimetype: { type: String },
	size: { type: Number },
	createdAt: {
		type: Date,
		default: Date.now(),
	},
	chatRoom: {
		type: mongoose.Schema.ObjectId,
		ref: "ChatRoom",
	},
	fromUser: {
		type: mongoose.Schema.ObjectId,
		ref: "User",
	},
});

const ImageMessage = mongoose.model("ImageMessage", imageMessage);

module.exports = ImageMessage;
