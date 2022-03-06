const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema(
	{
		createdAt: {
			type: Date,
			default: Date.now(),
		},
		userID1: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
		},
		userID2: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);
module.exports = ChatRoom;
