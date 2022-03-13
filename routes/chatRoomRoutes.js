const express = require("express");
const chatRoomController = require("./../controllers/chatRoomController");
const authController = require("./../controllers/authController");

const router = express.Router();

router
	.route("/chatRooms")
	.get(chatRoomController.getAllChatRooms)
	.post(authController.protect, chatRoomController.createChatRoom);

router
	.route("/chatRooms/:id")
	.get(chatRoomController.getOneChatRoom)
	.patch(chatRoomController.updateChatRoom)
	.delete(chatRoomController.deleteChatRoom);

router
	.route("/chatRooms/:userID1/:userID2")
	.get(chatRoomController.getChatRoomBasedOnUsers);

router
	.route("/userchats/:userID1")
	.get(authController.protect, chatRoomController.getUserChats);

module.exports = router;
