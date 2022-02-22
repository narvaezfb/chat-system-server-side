const FriendShip = require('./../models/friendshipModel');

exports.createFriendship = async (req, res, next) => {
	const friendship = await FriendShip.create(req.body);
	res.status(201).json({
		status: 'success',
		data: {
			friendship,
		},
	});
};

exports.getAllFriendships = async (req, res, next) => {
	const friendships = await FriendShip.find({ firstUser: req.params.id })
		.populate('secondUser')
		.select('secondUser');

	res.status(200).json({
		status: 'success',
		data: {
			friendships: friendships,
		},
	});
};
