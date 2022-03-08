const ChatRoom = require("./../models/chatRoomModel");

exports.createChatRoom = async (req, res, next) => {
	const validateExistingChatRoom = await ChatRoom.find({
		$or: [
			{ userID1: req.body.userID1, userID2: req.body.userID2 },
			{ userID1: req.body.userID2, userID2: req.body.userID1 },
		],
	});

	if (validateExistingChatRoom.length === 0) {
		const chatRoom = await ChatRoom.create(req.body);
		res.status(201).json({
			status: "success",
			data: {
				chatRoom,
			},
		});
	} else {
		return next("chatRoom already exists");
	}

	// res.send({ status: "failed", data: { validateExistingChatRoom } });

	// return next("this chat already exists ");
};

exports.getAllChatRooms = async (req, res, next) => {
	const chatRooms = await ChatRoom.find().populate(["userID1", "userID2"]);
	res.status(200).json({
		status: "success",
		data: {
			chatRooms,
		},
	});
};
exports.getOneChatRoom = async (req, res, next) => {
	const chatRoom = await ChatRoom.findById(req.params.id);
	if (!chatRoom) {
		return res.status(404).json({
			status: "failed",
		});
	}
	res.status(200).json({
		status: "success",
		data: {
			chatRoom,
		},
	});
};
exports.updateChatRoom = async (req, res, next) => {
	const chatRoom = await ChatRoom.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!chatRoom) {
		return next("no chatroom found with that ID");
	}

	res.status(200).json({
		status: "success",
		data: {
			chatRoom,
		},
	});
};
exports.deleteChatRoom = async (req, res, next) => {
	const chatRoom = await ChatRoom.findByIdAndDelete(req.params.id);
	if (!chatRoom) {
		return next("no chatroom found with that ID");
	}
	res.status(200).json({
		status: "success",
	});
};

exports.getChatRoomBasedOnUsers = async (req, res, next) => {
	const chatRoom = await ChatRoom.find({
		userID1: req.params.userID1,
		userID2: req.params.userID2,
	}).populate("friendship");

	if (chatRoom.length === 0) {
		return res.send({ status: "failed" });
	}

	res.status(200).json({
		status: "success",
		data: {
			chatRoom,
		},
	});
};

exports.getUserChats = async (req, res, next) => {
	const chatRooms = await ChatRoom.find({
		$or: [{ userID1: req.params.userID1 }, { userID2: req.params.userID1 }],
	}).populate(["userID1", "userID2"]);

	if (chatRooms.length === 0)
		return res.send({ status: "This user does not have any chats " });

	res.status(200).json({
		status: "success",
		data: {
			chatRooms,
		},
	});
};
