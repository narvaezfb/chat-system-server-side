const mongoose = require("mongoose");
const validator = require("validator");

const messageSchema = new mongoose.Schema(
	{
		message: {
			type: String,
		},
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
		audio: {
			type: String,
		},
		image: {
			type: String,
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

const Message = new mongoose.model("Message", messageSchema);
module.exports = Message;
