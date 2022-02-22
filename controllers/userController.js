const User = require('./../models/userModel');

exports.getAllUsers = async (req, res, next) => {
	const users = await User.find();
	res.status(200).json({
		status: 'success',
		results: users.length,
		data: {
			users: users,
		},
	});
};

exports.getOneUser = async (req, res, next) => {
	const user = await User.findById(req.params.id);
	if (!user) {
		return next('this user does not exist');
	}

	res.status(200).json({
		status: 'succes',
		data: {
			user: user,
		},
	});
};

exports.updateUser = async (req, res, next) => {
	const user = await User.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!user) {
		return next('no user found with that id');
	}

	res.status(200).json({
		status: 'success',
		data: {
			user,
		},
	});
};
