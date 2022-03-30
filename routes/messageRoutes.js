const express = require("express");
const messageController = require("./../controllers/messageController");
const authController = require("./../controllers/authController");

const router = express.Router();

router
	.route("/messages")
	.get(messageController.getAllMessages)
	.post(messageController.createMessage);

router
	.route("/messages/:id")
	.get(messageController.getOneMessage)
	.patch(authController.protect, messageController.updateMessage)
	.delete(authController.protect, messageController.deleteMessage);

router
	.route("/chatRoom/:id/messages")
	.get(authController.protect, messageController.getMessagesByChatRoom);

module.exports = router;
