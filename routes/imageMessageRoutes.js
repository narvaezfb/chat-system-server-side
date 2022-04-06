const express = require("express");
const imageMessageController = require("./../controllers/imageMessageController");

const router = express.Router();

router
	.route("/imageMessages")
	.post(
		imageMessageController.uploadMessageHandler,
		imageMessageController.createImageMessage
	)
	.get(imageMessageController.getAllImageMessages);

router
	.route("/imageMessages/:filename")
	.get(imageMessageController.getOneImage);

router
	.route("/imageMessages/chatRoom/:chatRoom")
	.get(imageMessageController.imageMessages);

module.exports = router;
