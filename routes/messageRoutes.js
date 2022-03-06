const express = require("express");
const messageController = require("./../controllers/messageController");

const router = express.Router();

router
	.route("/messages")
	.get(messageController.getAllMessages)
	.post(messageController.createMessage);

router
	.route("/messages/:id")
	.get(messageController.getOneMessage)
	.patch(messageController.updateMessage)
	.delete(messageController.deleteMessage);

router
	.route("/chatRoom/:id/messages")
	.get(messageController.getMessagesByChatRoom);

module.exports = router;
