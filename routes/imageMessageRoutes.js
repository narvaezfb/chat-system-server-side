const express = require("express");
const audioMessageController = require("./../controllers/imageMessageController");

const router = express.Router();

router
	.route("/imageMessages")
	.post(
		audioMessageController.uploadMessageHandler,
		audioMessageController.createImageMessage
	)
	.get(audioMessageController.getAllImageMessages);

router
	.route("/imageMessages/:filename")
	.get(audioMessageController.getOneImage);

module.exports = router;
