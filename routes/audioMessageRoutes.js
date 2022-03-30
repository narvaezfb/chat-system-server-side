const express = require("express");
const audioMessageController = require("./../controllers/audioMessageController");

const router = express.Router();

router
	.route("/audioMessages")
	.post(
		audioMessageController.uploadAudioHandler,
		audioMessageController.createAudioMessage
	)
	.get(audioMessageController.getAllAudioMessages);

router
	.route("/getAllAudioMessagesToClient")
	.get(audioMessageController.getAllAudioMessagesToClient);

router
	.route("/audioMessages/:filename")
	.get(audioMessageController.getOneAudioMessage);

router
	.route("/audioMessages/reproduce/:filename")
	.get(audioMessageController.reproduceOneAudioMessage);

router
	.route("/audioMessages/chatRoom/:chatRoom")
	.get(audioMessageController.audioMessages);

module.exports = router;
