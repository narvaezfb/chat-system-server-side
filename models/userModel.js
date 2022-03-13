const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please tell us your name"],
	},
	email: {
		type: String,
		require: [true, "please enter email"],
		unique: true,
		lowercase: true,
		validate: [validator.isEmail, "Please provide a valid email "],
	},
	password: {
		type: String,
		required: [true, "Please provide password"],
		minlength: 8,
		select: false,
	},
	passwordConfirm: {
		type: String,
		required: [true, "please confirm your password"],
		validate: {
			//this only works on create and save
			validator: function (el) {
				return el === this.password;
			},
			message: "Passwords are not the same",
		},
	},
	passwordChangedAt: {
		type: Date,
	},
});

userSchema.pre("save", async function (next) {
	//only runs if password was modified
	if (!this.isModified("password")) return next();
	//hash the password with cost of 12
	this.password = await bcrypt.hash(this.password, 12);
	this.passwordConfirm = undefined;
	next();
});

//create instance method
userSchema.methods.correctPassword = async function (
	candidatePassword,
	userPassword
) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
	if (this.passwordChangedAt) {
		const changedTimestamp = parseInt(
			this.passwordChangedAt.getTime() / 1000,
			10
		);
		console.log(changedTimestamp, JWTTimestamp);
		return JWTTimestamp < changedTimestamp;
	}
	return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
