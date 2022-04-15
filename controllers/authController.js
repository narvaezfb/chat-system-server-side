const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

//function that signs a new token
// const signToken = (id) => {
// 	return jwt.sign({ id: id }, process.env.JWT_SECRET, {
// 		expiresIn: process.env.JWT_EXPIRES_IN,
// 	});
// };

const signToken = (id) => {
	return jwt.sign({ id: id }, "my-ultra-really-safe-long-secret-dc-chat2022", {
		expiresIn: "90d",
	});
};

exports.signup = async (req, res, next) => {
	try {
		// const newUser = await User.create(req.body);
		const newUser = await User.create(req.body);

		//create a new token by calling the function
		const token = signToken(newUser._id);

		res.status(201).json({
			status: "succces",
			token,
			data: {
				user: newUser,
			},
		});
	} catch (e) {
		console.log(e);
	}
};

exports.login = async (req, res, next) => {
	//get the email and password from the request body
	const { email, password } = req.body;

	//check if email and password exists
	if (!email || !password) {
		res.send({ status: "failed" });
		return next("please provide email or password ");
	}

	//check if user exists and password is correct
	const user = await User.findOne({ email: email }).select("+password");

	if (!user || !(await user.correctPassword(password, user.password))) {
		res.send({ status: "failed" });
		return next("Incorrect email or password");
	}

	//if everything is okay send token to client
	const token = signToken(user._id);

	//create a new session
	req.session.user = user;
	req.user = user;
	console.log(req.session.user);
	console.log(req.user);

	//send data back to the client
	res.status(200).json({
		status: "success",
		auth: true,
		token,
	});
};

exports.checkUserLogin = (req, res, next) => {
	if (req.session.user) {
		res.status(200).json({
			loggedIn: true,
			user: req.session.user,
		});
	} else {
		res.status(200).json({
			loggedIn: false,
		});
	}
};

exports.protect = async (req, res, next) => {
	// get the token and check if it exists
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];
	}

	if (!token) {
		return next("token does not exixts");
	}
	// validate the token
	try {
		// const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
		const decoded = await promisify(jwt.verify)(
			token,
			"my-ultra-really-safe-long-secret-dc-chat2022"
		);
		// check if user still exists
		const freshUser = await User.findById(decoded.id);
		if (!freshUser) {
			next("user does not exist anymore");
		}
		//check if user changed password after jwt was issued
		if (freshUser.changedPasswordAfter(decoded.iat)) {
			return next("password has been changed recently, please log in again");
		}

		//grant access to the protected route
		req.user = freshUser;
		req.userId = decoded.id;
		next();
	} catch (error) {
		console.log(error);
	}
};
