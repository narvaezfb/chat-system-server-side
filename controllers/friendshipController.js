const FriendShip = require("./../models/friendshipModel");

exports.createFriendship = async (req, res, next) => {
	const friendship = await FriendShip.create(req.body);
	res.status(201).json({
		status: "success",
		data: {
			friendship,
		},
	});
};

exports.getOneFriendship = async (req, res, next) => {
	const frienship = await FriendShip.findById(req.params.id).populate([
		"firstUser",
		"secondUser",
	]);
	if (!frienship) return next("no friendship with tha ID");

	res.status(200).json({
		status: "success",
		data: {
			frienship,
		},
	});
};

exports.getAllFriendshipsOfUser = async (req, res, next) => {
	const friendships = await FriendShip.find({ firstUser: req.params.id })
		.populate(["secondUser", "firstUser"])
		.select("secondUser");

	res.status(200).json({
		status: "success",
		data: {
			friendships: friendships,
		},
	});
};

exports.getAllFriendships = async (req, res, next) => {
	const friendships = await FriendShip.find().populate([
		"firstUser",
		"secondUser",
	]);

	res.status(200).json({
		status: "success",
		data: {
			friendships: friendships,
		},
	});
};

exports.test = async (req, res, next) => {
	const friendship = await FriendShip.find({
		firstUser: req.params.firstUserId,
		secondUser: req.params.secondUserId,
	});

	if (!friendship) return next("no friendship found with that ID");

	res.status(200).json({
		status: "success",
		data: {
			friendship,
		},
	});
};
