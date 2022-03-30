const multer = require("multer");
const Message = require("./../models/messageModel");

exports.createMessage = async (req, res, next) => {
	console.log(req.file);
	if (req.file) req.body.audio = req.file.filename;
	const message = await Message.create(req.body);
	res.status(201).json({
		status: "success",
		data: {
			message,
		},
	});
};

exports.getAllMessages = async (req, res, next) => {
	const messages = await Message.find().populate([
		"User",
		"chatRoom",
		"AudioMessage",
	]);
	res.status(200).json({
		status: "success",
		data: {
			messages,
		},
	});
};
exports.getOneMessage = async (req, res, next) => {
	const message = await Message.findById(req.params.id);
	if (!message) {
		return next("no message found with that ID");
	}
	res.status(200).json({
		status: "success",
		data: {
			message,
		},
	});
};
exports.updateMessage = async (req, res, next) => {
	const message = await Message.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!message) {
		return next("no message found with that ID");
	}

	res.status(200).json({
		status: "success",
		data: {
			message,
		},
	});
};
exports.deleteMessage = async (req, res, next) => {
	const message = await Message.findByIdAndDelete(req.params.id);
	if (!message) {
		return next("no message found with that ID");
	}
	res.status(200).json({
		status: "success",
	});
};

exports.getMessagesByChatRoom = async (req, res, next) => {
	const messages = await Message.find({ chatRoom: req.params.id }).populate([
		"User",
		"chatRoom",
		"audio",
	]);

	if (messages.length <= 0)
		return res.send({
			status: "failed",
			data: "no messages exist in this chat yet",
		});

	res.status(200).json({
		status: "success",
		length: messages.length,
		data: {
			messages,
		},
	});
};
