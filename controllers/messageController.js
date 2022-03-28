const multer = require("multer");
const Message = require("./../models/messageModel");

const multerImageStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "public/img/messages");
	},
	filename: (req, file, cb) => {
		const ext = file.mimetype.split("/")[1];
		cb(null, `image-message-${Date.now()}.${ext}`);
	},
});

const multerAudioStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "public/audios");
	},
	filename: (req, file, cb) => {
		const ext = file.mimetype.split("/")[1];
		cb(null, `audio-message-${Date.now()}.mp3`);
	},
});

const multerImageFilter = (req, file, cb) => {
	if (file.mimetype.startsWith("image")) {
		cb(null, true);
	} else {
		cb(() => {
			console.log("please upload only images");
		}, false);
	}
};

const multerAudioFilter = (req, file, cb) => {
	if (file.mimetype.startsWith("audio")) {
		cb(null, true);
	} else {
		cb(() => {
			console.log("please upload only audio");
		}, false);
	}
};

const uploadImage = multer({
	storage: multerImageStorage,
	fileFilter: multerImageFilter,
});
const uploadAudio = multer({
	storage: multerAudioStorage,
	fileFilter: multerAudioFilter,
});

exports.uploadImageHandler = uploadImage.single("image");

exports.uploadAudioHandler = uploadAudio.single("audio");

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
	const messages = await Message.find().populate(["User", "chatRoom"]);
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
	const messages = await Message.find({ chatRoom: req.params.id });

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
